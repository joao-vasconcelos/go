import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import * as fs from 'fs';
import AdmZip from 'adm-zip';
import { Model as AgencyModel } from '../../../schemas/Agency/model';
import { Model as LineModel } from '../../../schemas/Line/model';
import { Model as RouteModel } from '../../../schemas/Route/model';
import { Model as PatternModel } from '../../../schemas/Pattern/model';
import { Model as StopModel } from '../../../schemas/Stop/model';
import { Model as CalendarModel } from '../../../schemas/Calendar/model';
import { Model as ShapeModel } from '../../../schemas/Shape/model';

/* * */
/* CONSTANSTS */

const TEMP_WRITE_DIRECTORY = './export_temp';

/* * */
/* EXPORT GTFS V18 */
/* This endpoint returns a zip file. */
/* * */

export default async function exportGTFSv18(req, res) {
  //
  await delay();

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Parse request body into JSON
  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 2. Create temporary directory to hold the files
  try {
    // If the directory already exists, delete it with all the contents
    if (fs.existsSync(TEMP_WRITE_DIRECTORY)) fs.rmSync(TEMP_WRITE_DIRECTORY, { recursive: true, force: true });
    fs.mkdirSync(TEMP_WRITE_DIRECTORY); // Create a fresh empty directory
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not create temporary directory.' });
  }

  // 3. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4. Generate GTFS archive
  try {
    //

    // 4.1.
    // Retrieve all the lines that match the given agency_id
    const agencyData = await AgencyModel.findOne({ _id: req.body.agency_id });

    // 4.2.
    // Retrieve all the lines that match the given parameters
    const allLines = await LineModel.find({})
      .limit(10)
      .populate({
        path: 'routes',
        populate: {
          path: 'patterns',
          populate: [
            {
              path: 'shape',
              select: 'code',
            },
            {
              path: 'path.stop',
              select: 'code',
            },
            {
              path: 'schedules.calendars_on',
              select: 'code',
            },
          ],
        },
      });

    // 4.3.
    // For this route, build its entry in the agency.txt file
    const parsedAgency = parseAgency(agencyData);
    writeCsvToFile('agency.txt', parsedAgency);

    // 4.4.
    // In order to build stops.txt, shapes.txt and calendar_dates.txt it is necessary
    // to initiate these variables outside all loops that hold the _ids
    // of the objects that are referenced in the other objects (trips, patterns)
    let referencedStopIds = [];
    let referencedShapeIds = [];
    let referencedCalendarIds = [];

    // 4.5.
    // Iterate on all the lines
    for (const lineData of allLines) {
      //

      // 4.5.1.
      // Skip if this line has no routes
      if (!lineData.routes) continue;

      // 4.5.2.
      // Iterate on all the routes for the given line
      for (const routeData of lineData.routes) {
        //

        // 4.5.2.1.
        // Skip if this route has no patterns
        if (!routeData.patterns) continue;

        // 4.5.2.2.
        // Write the .txt entry for this route
        const parsedRoute = parseRoute(agencyData, lineData, routeData);
        writeCsvToFile('routes.txt', parsedRoute);

        // 4.5.2.3.
        // Iterate on all the patterns for the given route
        for (const patternData of routeData.patterns) {
          //

          // 4.5.2.3.1.
          // Skip if this pattern has no schedules or no path
          if (!patternData.schedules || !patternData.path) continue;

          // 4.5.2.3.4.2.
          // Append the shape_id of this schedule to the scoped referenced calendar IDs array
          referencedShapeIds.push(patternData.shape._id);

          // 4.5.2.3.4.
          // Iterate on all the schedules for the given pattern
          for (const scheduleData of patternData.schedules) {
            //

            // 4.5.2.3.4.1.
            // Skip if this schedule has no associated calendars with service
            if (!scheduleData.calendars_on) continue;

            // 4.5.2.3.4.3.
            // Iterate on all the calendars associated with this schedule
            for (const calendarData of scheduleData.calendars_on) {
              //

              // 4.5.2.3.4.2.
              // Append the calendar_id of this schedule to the scoped referenced calendar IDs array
              referencedCalendarIds.push(calendarData._id);

              // 4.5.2.3.4.3.1.
              // Build the trip_id based on the route_code, direction, calendar_code and start_time of this schedule
              // Remove the : from this schedules start_time to use it as the
              const startTimeStripped = scheduleData.start_time.split(':').join('');
              const thisTripId = `${routeData.code}_${patternData.direction}_${calendarData.code}_${startTimeStripped}`;

              // 4.5.2.3.4.3.2.
              // Write the .txt entry for this trip
              writeCsvToFile('trips.txt', {
                route_id: routeData.code,
                pattern_id: patternData.code,
                pattern_short_name: patternData.headsign,
                service_id: calendarData.code,
                calendar_desc: calendarData.description,
                trip_id: thisTripId,
                trip_headsign: patternData.headsign,
                direction_id: patternData.direction,
                shape_id: patternData.shape.code,
              });

              // 4.5.2.3.4.3.3.
              // Calculate the arrival_time for each stop
              // Start by collecting the arrival time of the first stop in the path
              // and hold it outside the path loop to keep updating it relative to each iteration
              let currentTripTime = scheduleData.start_time;

              // 4.5.2.3.4.3.4.
              // Calculate the accumulated trip distance for each stop
              // Trip distance is incremented relative to each iteration
              // so hold the variable outside the path loop, and initiate it with zero
              let currentTripDistance = 0;

              // 4.5.2.3.4.3.5.
              // Iterate on all the calendars associated with this schedule
              for (const [pathIndex, pathData] of patternData.path.entries()) {
                //

                // 4.5.2.3.4.2.
                // Append the stop_id of this path sequence to the scoped referenced stop IDs array
                referencedStopIds.push(pathData.stop._id);

                // 4.5.2.3.4.3.5.1.
                // Increment the arrival_time for this stop with the travel time for this path segment
                // If the schedule has a travel time override, then use that instead of the default (not yet implemented)
                // In the first iteration, the travel time is zero, so we get the start_time as the current trip time.
                currentTripTime = incrementTime(currentTripTime, pathData.default_travel_time);

                // 4.5.2.3.4.3.5.2.
                // Increment the arrival_time for this stop with the dwell time
                // If the schedule has a dwell time override, then use that instead of the default (not yet implemented)
                const thisStopDepartureTime = incrementTime(currentTripTime, pathData.default_dwell_time);

                // 4.5.2.3.4.3.5.3.
                // Increment the distance for this path segment with the distance delta
                currentTripDistance = currentTripDistance + pathData.distance_delta;

                // 4.5.2.3.4.3.5.3.
                // Write the .txt entry for this stop_time
                writeCsvToFile('stop_times.txt', {
                  trip_id: thisTripId,
                  arrival_time: currentTripTime,
                  departure_time: thisStopDepartureTime,
                  stop_id: pathData.stop.code,
                  stop_sequence: pathIndex,
                  pickup_type: pathData.allow_pickup ? 0 : 1,
                  drop_off_type: pathData.allow_drop_off ? 0 : 1,
                  shape_dist_traveled: currentTripDistance,
                  timepoint: 1,
                });
                //
              }
            }
          }

          //
        }
      }
    }

    // 4.5.2.3.3.
    // Write the .txt entry for referenced shapes
    const referencedShapeDocuments = await ShapeModel.find({ _id: { $in: referencedShapeIds } });
    for (const shapeData of referencedShapeDocuments) {
      const parsedShape = parseShape(shapeData);
      writeCsvToFile('shapes.txt', parsedShape);
    }

    // 4.5.2.3.3.
    // Write the .txt entry for referenced calendars
    const referencedCalendarDocuments = await CalendarModel.find({ _id: { $in: referencedCalendarIds } });
    for (const calendarData of referencedCalendarDocuments) {
      const parsedCalendar = parseCalendar(calendarData);
      writeCsvToFile('calendar_dates.txt', parsedCalendar);
    }

    // 4.5.2.3.3.
    // Write the .txt entry for referenced stops
    const referencedStopDocuments = await StopModel.find({ _id: { $in: referencedStopIds } });
    for (const stopData of referencedStopDocuments) {
      const parsedStop = parseStop(stopData);
      writeCsvToFile('stops.txt', parsedStop);
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot generate GTFS archive.' });
  }

  // 5. Zip the files and return them to the client
  try {
    zipFiles(['agency.txt', 'routes.txt', 'calendar_dates.txt', 'trips.txt', 'stop_times.txt', 'shapes.txt', 'stops.txt'], 'output-gtfs.zip');
    res.writeHead(200, { 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename=output-gtfs.zip' });
    fs.createReadStream(`${TEMP_WRITE_DIRECTORY}/output-gtfs.zip`).pipe(res);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot compress files.' });
  }

  //
}

//
//
//
//
//
//
//
//
//
//

/* * */
/* BUILD ROUTE OBJECT ENTRY */
/* Build an agency object entry */
function parseAgency(agency) {
  return {
    agency_id: agency.code,
    agency_name: agency.name,
    agency_url: agency.url || 'https://www.carrismetropolitana.pt',
    agency_timezone: agency.timezone,
    agency_lang: agency.lang,
    agency_phone: agency.phone,
    agency_fare_url: agency.fare_url,
    agency_email: agency.email,
  };
}

//
//
//
//
//
//
//
//
//

/* * */
/* PARSE ROUTE */
/* Build a route object entry */
function parseRoute(agency, line, route) {
  return {
    line_id: line.code,
    line_short_name: line.short_name,
    line_long_name: line.long_name,
    line_type: 0,
    route_id: route.code,
    agency_id: agency.code,
    route_origin: 'line.origin',
    route_destination: 'line.destination',
    route_short_name: line.short_name,
    route_long_name: route.name,
    route_type: 3,
    path_type: 1,
    circular: line.circular ? 1 : 0,
    school: 0,
    route_color: line.color.slice(1),
    route_text_color: line.text_color.slice(1),
  };
}

//
//
//
//
//
//
//
//
//
//

/* * */
/* PARSE SHAPE */
/* Build a shape object entry */
function parseShape(shape) {
  const parsedShape = [];
  for (const shapePoint of shape.points) {
    parsedShape.push({
      shape_id: shape.code,
      shape_pt_lat: shapePoint.shape_pt_lat,
      shape_pt_lon: shapePoint.shape_pt_lon,
      shape_pt_sequence: shapePoint.shape_pt_sequence,
      shape_dist_traveled: shapePoint.shape_dist_traveled,
    });
  }
  return parsedShape;
}

//
//
//
//
//
//
//
//
//
//

/* * */
/* PARSE CALENDAR */
/* Build a calendar_dates object entry */
function parseCalendar(calendar) {
  const parsedCalendar = [];
  for (const calendarDate of calendar.dates) {
    parsedCalendar.push({
      service_id: calendar.code,
      holiday: calendar.is_holiday ? 1 : 0,
      period: 999,
      day_type: 999,
      date: calendarDate,
      exception_type: 1,
    });
  }
  return parsedCalendar;
}

//
//
//
//
//
//
//
//
//
//

/* * */
/* PARSE STOP */
/* Build a trip object entry */
function parseStop(stop) {
  return {
    stop_id: stop.code,
    stop_id_stepp: '',
    stop_code: stop.code,
    stop_name: stop.name,
    stop_desc: '',
    stop_remarks: '',
    stop_lat: stop.latitude,
    stop_lon: stop.longitude,
    zone_id: '',
    zone_shift: '',
    stop_url: '',
    location_type: '',
    parent_station: '',
    stop_timezone: '',
    wheelchair_boarding: '',
    level_id: '',
    platform_code: '',
    entrance_restriction: '',
    exit_restriction: '',
    slot: '',
    signalling: '',
    shelter: '',
    bench: '',
    network_map: '',
    schedule: '',
    real_time_information: '',
    tariff: '',
    preservation_state: '',
    equipment: '',
    observations: '',
    region: '',
    municipality: '',
  };
}

//
//
//
//
//
//
//
//
//
//

/* * */
/* WRITE CSV TO FILE */
/* Parse and append data to an existing file */
function writeCsvToFile(filename, data, papaparseOptions) {
  // If data is not an array, then wrap it in one
  if (!Array.isArray(data)) data = [data];
  // Check if the file already exists
  const fileExists = fs.existsSync(`${TEMP_WRITE_DIRECTORY}/${filename}`);
  // Use papaparse to produce the CSV string
  let csvData = Papa.unparse(data, { header: !fileExists, ...papaparseOptions });
  // Prepend a new line character to csvData string if it is not the first line on the file
  if (fileExists) csvData = '\n' + csvData;
  // Append the csv string to the file
  fs.appendFileSync(`${TEMP_WRITE_DIRECTORY}/${filename}`, csvData);
}

//
//
//
//
//
//
//

/* * */
/* ZIP FILES */
/* Build a ZIP archive of an array of filenames */
function zipFiles(arrayOfFileNames, outputZipFilename) {
  // Create new ZIP variable
  const outputZip = new AdmZip();
  // Include all requested files
  for (const filename of arrayOfFileNames) {
    // Add the current filename to the zip archive
    outputZip.addLocalFile(`${TEMP_WRITE_DIRECTORY}/${filename}`);
  }
  // Build the ZIP archive
  outputZip.writeZip(`${TEMP_WRITE_DIRECTORY}/${outputZipFilename}`);
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//

//HELPER TIMES
function incrementTime(timeString, increment) {
  // Parse the time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  // Calculate the new total seconds
  const totalSeconds = hours * 3600 + minutes * 60 + seconds + increment;

  // Calculate the new hours, minutes, and seconds
  const newHours = Math.floor(totalSeconds / 3600) % 24;
  const newMinutes = Math.floor(totalSeconds / 60) % 60;
  const newSeconds = totalSeconds % 60;

  // Format the new time string
  const newTimeString = `${padZero(newHours)}:${padZero(newMinutes)}:${padZero(newSeconds)}`;

  return newTimeString;
}

// Helper function to pad single-digit numbers with leading zeros
function padZero(num) {
  return num.toString().padStart(2, '0');
}
