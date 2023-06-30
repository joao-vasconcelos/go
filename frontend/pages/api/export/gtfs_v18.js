import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import * as fs from 'fs';
import AdmZip from 'adm-zip';
import { Model as AgencyModel } from '../../../schemas/Agency/model';
import { Model as LineModel } from '../../../schemas/Line/model';
import { Model as TypologyModel } from '../../../schemas/Typology/model';
import { Model as RouteModel } from '../../../schemas/Route/model';
import { Model as PatternModel } from '../../../schemas/Pattern/model';
import { Model as StopModel } from '../../../schemas/Stop/model';
import { Model as CalendarModel } from '../../../schemas/Calendar/model';

/* * */
/* EXPORT GTFS V18 */
/* This endpoint returns a zip file. */
/* * */

export default async function exportGTFSv18(req, res) {
  //
  await delay();

  //
  // 0. Refuse request if not POST

  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  //
  // 1. Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  //
  // 2. Validate form (TBD)

  //   try {
  //     req.body = await JSON.parse(req.body);
  //   } catch (err) {
  //     console.log(err);
  //     await res.status(500).json({ message: 'JSON parse error.' });
  //     return;
  //   }

  //
  // 3. Create temporary directory

  try {
    // If in development, then prepare the directory
    prepareTempDirectory();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not create temporary directory.' });
  }

  //
  // 4. Try to connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  //
  // 5. Try to connect to mongodb

  try {
    await buildGTFSv18(req.body.agency_id, req.body.lines);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Error building GTFS v18 archive.' });
  }

  //
  // 6. Zip the generated files and return them to the client

  try {
    const tempDirPath = getTempDirectoryPath();
    zipFiles(['agency.txt', 'routes.txt', 'calendar_dates.txt', 'trips.txt', 'stop_times.txt', 'shapes.txt', 'stops.txt'], 'output-gtfs.zip');
    res.writeHead(200, { 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename=output-gtfs.zip' });
    fs.createReadStream(`${tempDirPath}/output-gtfs.zip`).pipe(res);
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

/* * */
/* PROVIDE TEMP DIRECTORY PATH */
/* Return the path for the temporary directory based on current environment. */
function getTempDirectoryPath() {
  // If in development, then return the 'tmp' folder in the current directory
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') return './tmp';
  // If in production, return the server provided root 'tmp' folder
  else return '/tmp/export';
  //
}

//
//
//
//

/* * */
/* PREPARE TEMPORARY DIRECTORY */
/* Delete and recreate the temp directory to hold the generated files. */
function prepareTempDirectory() {
  // Get directory path based on environment
  const tempDirPath = getTempDirectoryPath();
  // If the directory already exists, delete it with all the contents
  if (fs.existsSync(tempDirPath)) fs.rmSync(tempDirPath, { recursive: true, force: true });
  fs.mkdirSync(tempDirPath); // Create a fresh empty directory
  //
}

//
//
//
//

/* * */
/* WRITE CSV TO FILE */
/* Parse and append data to an existing file. */
function writeCsvToFile(filename, data, papaparseOptions) {
  // Get temporary directory path
  const tempDirPath = getTempDirectoryPath();
  // If data is not an array, then wrap it in one
  if (!Array.isArray(data)) data = [data];
  // Check if the file already exists
  const fileExists = fs.existsSync(`${tempDirPath}/${filename}`);
  // Use papaparse to produce the CSV string
  let csvData = Papa.unparse(data, { header: !fileExists, ...papaparseOptions });
  // Prepend a new line character to csvData string if it is not the first line on the file
  if (fileExists) csvData = '\n' + csvData;
  // Append the csv string to the file
  fs.appendFileSync(`${tempDirPath}/${filename}`, csvData);
}

//
//
//
//

/* * */
/* ZIP FILES */
/* Build a ZIP archive of an array of filenames. */
function zipFiles(arrayOfFileNames, outputZipFilename) {
  // Get temporary directory path
  const tempDirPath = getTempDirectoryPath();
  // Create new ZIP variable
  const outputZip = new AdmZip();
  // Include all requested files
  for (const filename of arrayOfFileNames) {
    // Add the current filename to the zip archive
    outputZip.addLocalFile(`${tempDirPath}/${filename}`);
  }
  // Build the ZIP archive
  outputZip.writeZip(`${tempDirPath}/${outputZipFilename}`);
  //
}

//
//
//
//

/* * */
/* PARSE AND SUM TIME STRING */
/* Parse a GTFS-standard time string in the format HH:MM:SS and sum it */
/* with a given increment in seconds. Return a string in the same format. */
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
  return `${padZero(newHours)}:${padZero(newMinutes)}:${padZero(newSeconds)}`;
  //
}

//
//
//
//

/* * */
/* PAD ZEROS */
/* Add zeros to start of string if length is less than 2. */
function padZero(num) {
  return num.toString().padStart(2, '0');
}

//
//
//
//

/* * */
/* GET AGENCY DATA */
/* Fetch the database for the given agency_id. */
async function getAgencyData(agencyId) {
  return await AgencyModel.findOne({ _id: agencyId });
}

//
//
//
//

/* * */
/* GET TYPOLOGY DATA */
/* Fetch the database for the given typology_id. */
async function getTypologyData(typologyId) {
  return await TypologyModel.findOne({ _id: typologyId });
}

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

/* * */
/* GET ALL LINES DATA */
/* Fetch the database for the given agency_id. */
async function getAllLinesData(filterParams) {
  // Populate nested fields all at once to avoid incresing lengthy db calls
  const populateParams = {
    path: 'routes',
    populate: {
      path: 'patterns',
      populate: [
        { path: 'shape', select: 'code' },
        { path: 'path.stop', select: 'code' },
        { path: 'schedules.calendars_on', select: 'code' },
      ],
    },
  };
  // Request database with the given params
  return await LineModel.find(filterParams).populate(populateParams);
}

//
//
//
//

/* * */
/* PARSE ROUTE */
/* Build a route object entry */
function parseRoute(agency, line, typology, route) {
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
    school: line.school ? 1 : 0,
    route_color: typology.color.slice(1),
    route_text_color: typology.text_color.slice(1),
  };
}

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

/* * */
/* BUILD GTFS V18 */
/* This builds the GTFS data model. */
async function buildGTFSv18(agencyId, lineIds) {
  //

  // 0.
  // In order to build stops.txt, shapes.txt and calendar_dates.txt it is necessary
  // to initiate these variables outside all loops that hold the _ids
  // of the objects that are referenced in the other objects (trips, patterns)
  const referencedStopIds = new Set();
  const referencedShapeIds = new Set();
  const referencedCalendarIds = new Set();

  // 1.
  // Retrieve the requested agency object
  // and write the entry for this agency in agency.txt file
  const agencyData = await getAgencyData(agencyId);
  const parsedAgency = parseAgency(agencyData);
  writeCsvToFile('agency.txt', parsedAgency);

  // 2.
  // Retrieve only the lines that match the requested parameters,
  // or all of them for the given agency if lineIds is empty.
  let linesFilterParams = { agency: agencyId };
  if (lineIds.length) linesFilterParams._id = { $in: lineIds };
  const allLinesData = await getAllLinesData(linesFilterParams);

  // 3.
  // Initiate the main loop that go through all lines
  // and progressively builds the GTFS files
  for (const lineData of allLinesData) {
    //
    // 3.1.
    // Skip if this line has no routes
    if (!lineData.routes) continue;

    // 3.2.
    // Get additional info associated with this line
    const typologyData = await getTypologyData(lineData.typology);

    // 3.3.
    // Because GTFS has no lines files, directly loop
    // on all the routes for this line
    for (const routeData of lineData.routes) {
      //
      // 3.3.1.
      // Skip if this route has no patterns
      if (!routeData.patterns) continue;

      // 3.2.2.
      // Write the routes.txt entry for this route
      const parsedRoute = parseRoute(agencyData, lineData, typologyData, routeData);
      writeCsvToFile('routes.txt', parsedRoute);

      // 3.2.3.
      // Iterate on all the patterns for the given route
      for (const patternData of routeData.patterns) {
        //
        // 3.2.3.1.
        // Skip if this pattern has no schedules or no path
        if (!patternData.schedules || !patternData.path) continue;

        // 3.2.3.2.
        // Append the shape_id of this pattern to the scoped variable
        referencedShapeIds.add(patternData.shape._id);

        // 3.2.3.3.
        // Iterate on all the schedules for the given pattern
        for (const scheduleData of patternData.schedules) {
          //
          // 3.2.3.3.1.
          // Skip if this schedule has no associated calendars
          if (!scheduleData.calendars_on) continue;

          // 3.2.3.3.2.
          // The rule for this GTFS version is to create as many trips as associated calendars.
          // For this, iterate on all the calendars associated with this schedule and build the trips.
          for (const calendarData of scheduleData.calendars_on) {
            //
            // 3.2.3.3.2.1.
            // Append the calendar_ids of this schedule to the scoped variable
            referencedCalendarIds.add(calendarData._id);

            // 3.2.3.3.2.2.
            // Remove the : from this schedules start_time to use it as the identifier for this trip.
            // Associate the route_code, direction, calendar_code and start_time of this schedule.
            const startTimeStripped = scheduleData.start_time.split(':').join('');
            const thisTripId = `${routeData.code}_${patternData.direction}_${calendarData.code}_${startTimeStripped}`;

            // 3.2.3.3.2.3.
            // Write the trips.txt entry for this trip
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

            // 3.2.3.3.2.4.
            // Calculate the arrival_time for each stop
            // Start by collecting the arrival time of the first stop in the path
            // and hold it outside the path loop to keep updating it relative to each iteration
            let currentArrivalTime = scheduleData.start_time;

            // 3.2.3.3.2.5.
            // Calculate the accumulated trip distance for each stop
            // Trip distance is incremented relative to each iteration
            // so hold the variable outside the path loop, and initiate it with zero
            let currentTripDistance = 0;

            // 3.2.3.3.2.6.
            // Iterate on all the calendars associated with this schedule
            for (const [pathIndex, pathData] of patternData.path.entries()) {
              //
              // 3.2.3.3.2.6.1.
              // Skip if this pathStop has no associated stop
              if (!pathData.stop) continue;

              // 3.2.3.3.2.6.2.
              // Append the stop_ids of this path to the scoped variable
              referencedStopIds.add(pathData.stop._id);

              // 3.2.3.3.2.6.3.
              // Increment the arrival_time for this stop with the travel time for this path segment
              // If the schedule has a travel time override, then use that instead of the default (not yet implemented)
              // In the first iteration, the travel time is zero, so we get the start_time as the current trip time.
              currentArrivalTime = incrementTime(currentArrivalTime, pathData.default_travel_time);

              // 3.2.3.3.2.6.4.
              // Increment the arrival_time for this stop with the dwell time
              // If the schedule has a dwell time override, then use that instead of the default (not yet implemented)
              const departureTime = incrementTime(currentArrivalTime, pathData.default_dwell_time);

              // 3.2.3.3.2.6.5.
              // Increment the travelled distance for this path segment with the distance delta
              currentTripDistance = currentTripDistance + pathData.distance_delta;

              // 3.2.3.3.2.6.6.
              // Write the stop_times.txt entry for this stop_time
              writeCsvToFile('stop_times.txt', {
                trip_id: thisTripId,
                arrival_time: currentArrivalTime,
                departure_time: departureTime,
                stop_id: pathData.stop.code,
                stop_sequence: pathIndex,
                pickup_type: pathData.allow_pickup ? 0 : 1,
                drop_off_type: pathData.allow_drop_off ? 0 : 1,
                shape_dist_traveled: currentTripDistance,
                timepoint: 1,
              });

              // 3.2.3.3.2.6.6.
              // The current trip time should now be equal to the departure time, so that the next iteration
              // also takes into the account the dwell time on the current stop.
              currentArrivalTime = departureTime;

              // End of path loop
            }

            // End of schedule calendars loop
          }

          // End of schedules loop
        }

        // End of patterns loop
      }

      // End of routes loop
    }

    // End of lines loop
  }

  // 4.
  // Fetch the referenced shapes and write the shapes.txt file
  for (const shapeId of referencedShapeIds) {
    const shapeData = [];
    // if (shapeData.points && shapeData.points.length) {
    //   const parsedShape = parseShape(shapeData);
    //   writeCsvToFile('shapes.txt', parsedShape);
    // }
  }

  // 5.
  // Fetch the referenced calendars and write the calendar_dates.txt file
  for (const calendarId of referencedCalendarIds) {
    const calendarData = await CalendarModel.findOne({ _id: calendarId });
    if (calendarData.dates && calendarData.dates.length) {
      const parsedCalendar = parseCalendar(calendarData);
      writeCsvToFile('calendar_dates.txt', parsedCalendar);
    }
  }

  // 6.
  // Fetch the referenced stops and write the stops.txt file
  for (const stopId of referencedStopIds) {
    const stopData = await StopModel.findOne({ _id: stopId }, 'code name tts_name latitude longitude');
    const parsedStop = parseStop(stopData);
    writeCsvToFile('stops.txt', parsedStop);
  }

  //
}
