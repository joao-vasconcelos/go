import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import delay from '@/services/delay';
import mongodb from '@/services/mongodb';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import * as fs from 'fs';
import AdmZip from 'adm-zip';
import { Default as ExportDefault } from '@/schemas/Export/default';
import { Model as ExportModel } from '@/schemas/Export/model';
import { Model as AgencyModel } from '@/schemas/Agency/model';
import { Model as LineModel } from '@/schemas/Line/model';
import { Model as TypologyModel } from '@/schemas/Typology/model';
import { Model as RouteModel } from '@/schemas/Route/model';
import { Model as PatternModel } from '@/schemas/Pattern/model';
import { Model as StopModel } from '@/schemas/Stop/model';
import { Model as CalendarModel } from '@/schemas/Calendar/model';

/* * */
/* EXPORT GTFS V18 */
/* This endpoint returns a zip file. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not POST

  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Define "semi-global"-scoped variables to be used later on in the function

  let session;
  let agencyData;
  let exportSummary;

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    //
    // 2.1.
    // Fetch latest session data from the database
    session = await getServerSession(req, res, authOptions);

    // 2.2.
    // Check if user is logged in. Cancel the request if not.
    if (!session) {
      return res.status(401).json({ message: 'You must be logged in to access this feature.' });
    }

    // 2.3.
    // Check if the current user has permission to access this feature
    if (!session?.user?.permissions?.export?.gtfs_v18) {
      return res.status(401).json({ message: 'You do not have permission to access this feature.' });
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not verify Authentication.' });
  }

  // 3.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 4.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Fetch Agency information for the current request.
  // This is will be used to name the resulting file.

  try {
    agencyData = await AgencyModel.findOne({ _id: req.body.agency_id });
    if (!agencyData) return await res.status(404).json({ message: 'Could not find requested Agency.' });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Error fetching Agency data.' });
  }

  // 6.
  // Create a new Export summary document.
  // This will be used to keep track of progress
  // and allows the client to download the resulting file at a later date.

  try {
    //
    // 6.1.
    // Create the Export document
    // This will generate a new _id for the operation.
    exportSummary = new ExportModel(ExportDefault);

    // 6.2.
    // Setup properties for this Export
    exportSummary.type = 1; // 1 = GTFS v18
    exportSummary.exported_by = session.user._id;
    exportSummary.filename = `GTFS_${agencyData.code}_OFFER_v18_today.zip`;
    exportSummary.workdir = getWorkdir(exportSummary._id);

    //6.3.
    // Save the export document
    await exportSummary.save();

    // 6.4.
    // Send the summary information to the client
    // and close the connection.
    await res.status(201).json(exportSummary);

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not create Export summary.' });
  }

  // 7.
  // Even though the server has already sent a response to the client,
  // start building the export file and keep track of progress.
  // From here on, errors must be tracked with the database
  // to keep the client informed about the operation status

  try {
    //
    // 7.1.
    // Update progress to indicate the two main tasks at hand
    await update(exportSummary, { progress_current: 0, progress_total: 2 });

    // 7.2.
    // Initiate the main export operation
    await buildGTFSv18(exportSummary, agencyData, req.body.lines);
    await update(exportSummary, { progress_current: 1, progress_total: 2 });

    // 7.3.
    // Zip the workdir folder that contains the generated files.
    // Name the resulting archive with the _id of this Export.
    const outputZip = new AdmZip();
    outputZip.addLocalFolder(exportSummary.workdir);
    outputZip.writeZip(`${exportSummary.workdir}/${exportSummary._id}.zip`);
    await update(exportSummary, { progress_current: 2, progress_total: 2 });

    // 7.4.
    // Update progress to indicate the requested operation is complete
    await update(exportSummary, { status: 2 });

    //
  } catch (err) {
    console.log(err);
    await update(exportSummary, { status: 5 });
  }

  //
}

//
//
//
//

/* * */
/* UPDATE PROGRESS */
/* Fetch the database for the given agency_id. */
async function update(exportDocument, updates) {
  await ExportModel.updateOne({ _id: exportDocument._id }, updates);
}

//
//
//
//

/* * */
/* PROVIDE TEMP DIRECTORY PATH */
/* Return the path for the temporary directory based on current environment. */
function getWorkdir(exportId) {
  // Use the 'tmp' folder as the working directory
  const workdir = `${process.env.PWD}/tmp/exports/${exportId}`;
  // Out of an abundance of caution, delete the directory and all its contents if it already exists
  if (fs.existsSync(workdir)) fs.rmSync(workdir, { recursive: true, force: true });
  // Create a fresh empty directory in the given path
  fs.mkdirSync(workdir, { recursive: true });
  // Return workdir to the caller
  return workdir;
  //
}

//
//
//
//

/* * */
/* WRITE CSV TO FILE */
/* Parse and append data to an existing file. */
function writeCsvToFile(workdir, filename, data, papaparseOptions) {
  // If data is not an array, then wrap it in one
  if (!Array.isArray(data)) data = [data];
  // Check if the file already exists
  const fileExists = fs.existsSync(`${workdir}/${filename}`);
  // Use papaparse to produce the CSV string
  let csvData = Papa.unparse(data, { header: !fileExists, ...papaparseOptions });
  // Prepend a new line character to csvData string if it is not the first line on the file
  if (fileExists) csvData = '\n' + csvData;
  // Append the csv string to the file
  fs.appendFileSync(`${workdir}/${filename}`, csvData);
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
function parseShape(code, points) {
  const parsedShape = [];
  for (const shapePoint of points) {
    parsedShape.push({
      shape_id: code,
      shape_pt_sequence: shapePoint.shape_pt_sequence,
      shape_pt_lat: shapePoint.shape_pt_lat,
      shape_pt_lon: shapePoint.shape_pt_lon,
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
async function buildGTFSv18(progress, agencyData, lineIds) {
  //

  // 0.
  // Update progress
  await update(progress, { status: 1, progress_current: 0, progress_total: 3 });

  // 0.
  // In order to build stops.txt, shapes.txt and calendar_dates.txt it is necessary
  // to initiate these variables outside all loops that hold the _ids
  // of the objects that are referenced in the other objects (trips, patterns)
  const referencedStopIds = new Set();
  const referencedCalendarIds = new Set();

  // 1.
  // Retrieve the requested agency object
  // and write the entry for this agency in agency.txt file
  const parsedAgency = parseAgency(agencyData);
  writeCsvToFile(progress.workdir, 'agency.txt', parsedAgency);
  //
  await update(progress, { progress_current: 1 });

  // 2.
  // Retrieve only the lines that match the requested parameters,
  // or all of them for the given agency if lineIds is empty.
  let linesFilterParams = { agency: agencyData._id };
  if (lineIds.length) linesFilterParams._id = { $in: lineIds };
  const allLinesData = await getAllLinesData(linesFilterParams);
  //
  await update(progress, { progress_current: 0, progress_total: allLinesData.length - 1 });

  // 3.
  // Initiate the main loop that go through all lines
  // and progressively builds the GTFS files
  for (const [lineIndex, lineData] of allLinesData.entries()) {
    //
    // 3.0.
    // Update progress
    await update(progress, { progress_current: lineIndex });

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
      writeCsvToFile(progress.workdir, 'routes.txt', parsedRoute);

      // 3.2.3.
      // Iterate on all the patterns for the given route
      for (const patternData of routeData.patterns) {
        //
        // 3.2.3.1.
        // Skip if this pattern has no schedules or no path
        if (!patternData.schedules || !patternData.path) continue;

        // 3.2.3.2.
        // Write the shaoes.txt entry for this pattern
        const parsedShape = parseShape(`shp_${patternData.code}`, patternData.shape.points);
        writeCsvToFile(progress.workdir, 'shapes.txt', parsedShape);

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
            writeCsvToFile(progress.workdir, 'trips.txt', {
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
              writeCsvToFile(progress.workdir, 'stop_times.txt', {
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

  // 5.
  // Update progress
  await update(progress, { status: 1, progress_current: 2, progress_total: 3 });

  // 6.
  // Fetch the referenced calendars and write the calendar_dates.txt file
  for (const calendarId of referencedCalendarIds) {
    const calendarData = await CalendarModel.findOne({ _id: calendarId });
    if (calendarData.dates && calendarData.dates.length) {
      const parsedCalendar = parseCalendar(calendarData);
      writeCsvToFile(progress.workdir, 'calendar_dates.txt', parsedCalendar);
    }
  }

  // 6.q.
  // Update progress
  await update(progress, { status: 1, progress_current: 3, progress_total: 3 });

  // 8.
  // Fetch the referenced stops and write the stops.txt file
  for (const stopId of referencedStopIds) {
    const stopData = await StopModel.findOne({ _id: stopId }, 'code name tts_name latitude longitude');
    const parsedStop = parseStop(stopData);
    writeCsvToFile(progress.workdir, 'stops.txt', parsedStop);
  }

  //
}
