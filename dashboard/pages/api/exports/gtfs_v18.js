import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import * as fs from 'fs';
import AdmZip from 'adm-zip';
import { Default as ExportDefault } from '@/schemas/Export/default';
import { Model as ExportModel } from '@/schemas/Export/model';
import { Model as AgencyModel } from '@/schemas/Agency/model';
import { Model as LineModel } from '@/schemas/Line/model';
import { Model as FareModel } from '@/schemas/Fare/model';
import { Model as TypologyModel } from '@/schemas/Typology/model';
import { Model as RouteModel } from '@/schemas/Route/model';
import { Model as MunicipalityModel } from '@/schemas/Municipality/model';
import { Model as ZoneModel } from '@/schemas/Zone/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { Model as StopModel } from '@/schemas/Stop/model';
import { Model as DateModel } from '@/schemas/Date/model';
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
    session = await checkAuthentication({ scope: 'export', permission: 'gtfs_v18', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
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
    exportSummary.filename = `GTFS_${agencyData.code}_OFFER_v18_${today()}.zip`;
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
    // Initiate the export options object with data from the client
    const exportOptions = {
      lines_included: req.body.lines_included || [],
      lines_excluded: req.body.lines_excluded || [],
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      concatenate_calendars: req.body.concatenate_calendars,
    };

    // 7.3.
    // Initiate the main export operation
    await buildGTFSv18(exportSummary, agencyData, exportOptions);
    await update(exportSummary, { progress_current: 1, progress_total: 2 });

    // 7.4.
    // Zip the workdir folder that contains the generated files.
    // Name the resulting archive with the _id of this Export.
    const outputZip = new AdmZip();
    outputZip.addLocalFolder(exportSummary.workdir);
    outputZip.writeZip(`${exportSummary.workdir}/${exportSummary._id}.zip`);
    await update(exportSummary, { progress_current: 2, progress_total: 2 });

    // 7.5.
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
  const workdir = `${process.env.PWD}/exported_files/${exportId}`;
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
/* Parse a GTFS-standard time string in the format HH:MM and sum it */
/* with a given increment in seconds. Return a string in the same format. */
function incrementTime(timeString, increment) {
  // Parse the time string into hours, minutes, and seconds
  const [hours, minutes] = timeString.split(':').map(Number);
  // Calculate the new total seconds
  const totalSeconds = hours * 3600 + minutes * 60 + increment;
  // Calculate the new hours, minutes, and seconds
  const newHours = Math.floor(totalSeconds / 3600);
  const newMinutes = Math.floor(totalSeconds / 60) % 60;
  const newSeconds = 0;
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
/* GET TODAY AS STRING */
/* Output the current date and time in the format YYYYMMDDHHMM. */
/* For example, if the current date is July 3, 2023, at 9:30 AM, the output will be 202307030930. */
function today() {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  var day = currentDate.getDate().toString().padStart(2, '0');
  var hours = currentDate.getHours().toString().padStart(2, '0');
  var minutes = currentDate.getMinutes().toString().padStart(2, '0');

  return year + month + day + hours + minutes;
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
    agency_name: 'Carris Metropolitana' || agency.name,
    agency_url: 'https://www.carrismetropolitana.pt' || agency.url,
    agency_timezone: 'Europe/Lisbon' || agency.timezone,
    agency_lang: 'pt' || agency.lang,
    agency_phone: '210410400' || agency.phone,
    agency_fare_url: agency.fare_url,
    agency_email: agency.email,
  };
}

//
//
//
//

/* * */
/* BUILD ROUTE OBJECT ENTRY */
/* Build an agency object entry */
function parseFeedInfo(agency, options) {
  return {
    feed_publisher_name: agency.name,
    feed_publisher_url: agency.url,
    feed_lang: 'pt',
    default_lang: 'en',
    feed_contact_url: 'https://github.com/carrismetropolitana/gtfs',
    feed_version: today(),
    feed_start_date: options.start_date,
    feed_end_date: options.end_date,
  };
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
    line_long_name: line.name,
    line_type: getLineType(typology.code),
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
/* PARSE FARE RULE */
/* Build a route object entry */
function parseFareRule(route, fare) {
  return {
    route_id: route.code,
    fare_id: fare.code,
  };
}

//
//
//
//

/* * */
/* PARSE FARE */
/* Build a route object entry */
function parseFare(fare) {
  return {
    fare_id: fare.code,
    price: fare.price,
    currency_type: fare.currency_type,
    payment_method: fare.payment_method,
    transfers: fare.transfers,
  };
}

//
//
//
//

/* * */
/* GET LINE TYPE */
/* For a given typology code return the corresponding type key */
function getLineType(typologyCode) {
  switch (typologyCode) {
    case 'PROXIMA':
      return 1;
    case 'LONGA':
      return 2;
    case 'RAPIDA':
      return 3;
    case 'INTER-REG':
      return 4;
    case 'MAR':
      return 5;
    default:
      return 0;
  }
}

//
//
//
//

/* * */
/* PARSE ZONING */
/* Build a zoning object entry */
async function parseZoning(lineData, patternData) {
  const parsedZoning = [];
  for (const [pathIndex, pathData] of patternData.path.entries()) {
    // Skip if this pathStop has no associated stop
    if (!pathData.stop) continue;
    // Get stop, municipality and zones data for this stop
    const stopData = await StopModel.findOne({ _id: pathData.stop }, 'code name latitude longitude municipality zones');
    const municipalityData = await MunicipalityModel.findOne({ _id: stopData.municipality }, 'code name');
    const allZonesData = await ZoneModel.find({ _id: pathData.zones }, 'code name');
    // Prepare zones in the file format
    let formattedZones = allZonesData.filter((zone) => zone.code !== 'AML').map((zone) => zone.code);
    if (formattedZones.length === 0) formattedZones = '0';
    else formattedZones = formattedZones.join('-');
    // Write the afetacao.txt entry for this path
    parsedZoning.push({
      line_id: lineData.code,
      pattern_id: patternData.code,
      stop_sequence: pathIndex,
      stop_id: stopData.code,
      stop_name: stopData.name || '',
      stop_lat: stopData.latitude || '0',
      stop_lon: stopData.longitude || '0',
      'Localizacao Paragem Municipios v2': municipalityData.name,
      'Aceitacao passes municipais': formattedZones,
    });

    // End of afetacao loop
  }
  return parsedZoning;
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
    // Prepare variables
    const shapePtLat = shapePoint.shape_pt_lat.toFixed(6);
    const shapePtLon = shapePoint.shape_pt_lon.toFixed(6);
    const shapeDistTraveled = ((shapePoint.shape_dist_traveled || 0) / 1000).toFixed(15);
    // Build shape point
    parsedShape.push({
      shape_id: code,
      shape_pt_sequence: shapePoint.shape_pt_sequence,
      shape_pt_lat: shapePtLat,
      shape_pt_lon: shapePtLon,
      shape_dist_traveled: shapeDistTraveled,
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
async function parseCalendar(calendar, startDate, endDate, shouldConcatenate) {
  // Initiate an new variable
  const parsedCalendar = [];
  // For each date in the calendar
  for (const calendarDate of calendar.dates) {
    // Tranform the current, start and end dates
    // into integers to allow for easy comparison
    const calendarDateInt = parseInt(calendarDate);
    const startDateInt = parseInt(startDate);
    const endDateInt = parseInt(endDate);
    // Skip adding the current date if it is not between the requested start and end dates
    if (shouldConcatenate && (calendarDateInt < startDateInt || calendarDateInt > endDateInt)) continue;
    // Get Date document for this calendar date
    const dateDocument = await DateModel.findOne({ date: calendarDate });
    // Skip if no date is found
    if (!dateDocument) continue;
    // Get the day_type for the current date
    let dayType = getDayType(calendarDate, calendar.is_holiday);
    // Build the date entry
    parsedCalendar.push({
      service_id: calendar.code,
      holiday: calendar.is_holiday ? 1 : 0,
      period: dateDocument.period,
      day_type: dayType,
      date: calendarDate,
      exception_type: 1,
    });
    //
  }
  // Return this calendar
  return parsedCalendar;
  //
}

//
//
//
//

/* * */
/* GET DAY TYPE FOR DATE */
/* Return 1, 2 or 3 for a given date */
function getDayType(date, isHoliday) {
  // Return 3 immediately if it is a holiday
  if (isHoliday) return 3;
  // Create a dayjs object
  const dateObj = dayjs(date, 'YYYYMMDD');
  // Get the weekday using dayjs
  const dayOfWeek = dateObj.day();
  // If it Weekday
  if (dayOfWeek >= 1 && dayOfWeek <= 5) return 1;
  // Saturday
  else if (dayOfWeek === 6) return 2;
  // Sunday
  else return 3;
  //
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
    stop_id_stepp: '0',
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
    region: stop.municipality?.region || '',
    municipality: stop.municipality?.code || '',
  };
}

//
//
//
//

/* * */
/* BUILD GTFS V18 */
/* This builds the GTFS archive. */
async function buildGTFSv18(progress, agencyData, exportOptions) {
  //

  // 0.
  // Update progress
  await update(progress, { status: 1, progress_current: 1, progress_total: 7 });

  // 0.1.
  // In order to build stops.txt, shapes.txt and calendar_dates.txt it is necessary
  // to initiate these variables outside all loops that hold the _ids
  // of the objects that are referenced in the other objects (trips, patterns)
  const referencedFareCodes = new Set();
  const referencedStopCodes = new Set();
  const referencedCalendarCodes = new Set();

  // 1.
  // Retrieve the requested agency object
  // and write the entry for this agency in agency.txt file
  const parsedAgency = parseAgency(agencyData);
  writeCsvToFile(progress.workdir, 'agency.txt', parsedAgency);
  //
  await update(progress, { progress_current: 2 });

  // 2.
  // Retrieve only the lines that match the requested export options,
  // or all of them for the given agency if 'lines_included' and 'lines_excluded' are empty.

  const linesFilterParams = { agency: agencyData._id };

  if (exportOptions.lines_included.length) linesFilterParams._id = { $in: exportOptions.lines_included };
  else if (exportOptions.lines_excluded.length) linesFilterParams._id = { $nin: exportOptions.lines_excluded };

  const allLinesData = await LineModel.find(linesFilterParams);

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
    const fareData = await FareModel.findOne({ _id: lineData.fare });
    const typologyData = await TypologyModel.findOne({ _id: lineData.typology });

    // 3.3.
    // Because GTFS has no lines files, directly loop
    // on all the routes for this line
    for (const routeId of lineData.routes) {
      //
      // 3.3.0.
      // Fetch route from database
      const routeData = await RouteModel.findOne({ _id: routeId });

      // 3.3.1.
      // Skip if this route has no patterns
      if (!routeData.patterns) continue;

      // 3.2.2.
      // Write the routes.txt entry for this route
      const parsedRoute = parseRoute(agencyData, lineData, typologyData, routeData);
      writeCsvToFile(progress.workdir, 'routes.txt', parsedRoute);

      // 3.2.3.
      // Write the fare_rules.txt entry for this route
      const parsedFareRule = parseFareRule(routeData, fareData);
      writeCsvToFile(progress.workdir, 'fare_rules.txt', parsedFareRule);
      referencedFareCodes.add(fareData.code);

      // 3.2.4.
      // Iterate on all the patterns for the given route
      for (const patternId of routeData.patterns) {
        //
        // 3.2.4.0.
        // Fetch pattern from database
        const patternData = await PatternModel.findOne({ _id: patternId });

        // 3.2.4.1.
        // Skip if this pattern has no schedules or no path
        if (!patternData.schedules || !patternData.path) continue;

        // 3.2.4.2.
        // Write the afetacao.txt entry for this pattern
        const parsedZoning = await parseZoning(lineData, patternData);
        writeCsvToFile(progress.workdir, 'afetacao.csv', parsedZoning);

        // 3.2.4.3.
        // Write the shapes.txt entry for this pattern
        const thisShapeCode = `shp_${patternData.code}`;
        const parsedShape = parseShape(thisShapeCode, patternData.shape.points);
        writeCsvToFile(progress.workdir, 'shapes.txt', parsedShape);

        // 3.2.4.4.
        // Iterate on all the schedules for the given pattern
        for (const scheduleData of patternData.schedules) {
          //
          // 3.2.4.4.1.
          // Skip if this schedule has no associated calendars
          if (!scheduleData.calendars_on) continue;

          // 3.2.4.4.2.
          // The rule for this GTFS version is to create as many trips as associated calendars.
          // For this, iterate on all the calendars associated with this schedule and build the trips.
          for (const calendarId of scheduleData.calendars_on) {
            //
            // 3.2.4.4.2.0.
            // Fetch calendar from database
            const calendarData = await CalendarModel.findOne({ _id: calendarId });

            // 3.2.4.4.2.1.
            // Skip if this calendar has no dates
            if (!calendarData.dates) continue;

            // 3.2.4.4.2.1.
            // Append the calendar_ids of this schedule to the scoped variable
            referencedCalendarCodes.add(calendarData.code);

            // 3.2.4.4.2.2.
            // Remove the : from this schedules start_time to use it as the identifier for this trip.
            // Associate the route_code, direction, calendar_code and start_time of this schedule.
            const startTimeStripped = scheduleData.start_time.split(':').join('');
            const thisTripCode = `${patternData.code}_${calendarData.code}_${startTimeStripped}`;

            // 3.2.4.4.2.3.
            // Write the trips.txt entry for this trip
            writeCsvToFile(progress.workdir, 'trips.txt', {
              route_id: routeData.code,
              pattern_id: patternData.code,
              pattern_short_name: patternData.headsign,
              service_id: calendarData.code,
              calendar_desc: calendarData.description,
              trip_id: thisTripCode,
              trip_headsign: patternData.headsign,
              direction_id: patternData.direction,
              shape_id: thisShapeCode,
              calendar_desc: scheduleData.calendar_desc,
            });

            // 3.2.4.4.2.4.
            // Calculate the arrival_time for each stop
            // Start by collecting the arrival time of the first stop in the path
            // and hold it outside the path loop to keep updating it relative to each iteration
            let currentArrivalTime = scheduleData.start_time;

            // 3.2.4.4.2.5.
            // Calculate the accumulated trip distance for each stop
            // Trip distance is incremented relative to each iteration
            // so hold the variable outside the path loop, and initiate it with zero
            let currentTripDistance = 0;

            // 3.2.4.4.2.6.
            // Iterate on all the calendars associated with this schedule
            for (const [pathIndex, pathData] of patternData.path.entries()) {
              //
              // 3.2.4.4.2.6.1.
              // Skip if this pathStop has no associated stop
              if (!pathData.stop) continue;

              // 3.2.4.4.2.6.2.
              // Fetch stop from database
              const stopData = await StopModel.findOne({ _id: pathData.stop }, 'code');

              // 3.2.4.4.2.6.2.
              // Append the stop_ids of this path to the scoped variable
              referencedStopCodes.add(stopData.code);

              // 3.2.4.4.2.6.3.
              // Increment the arrival_time for this stop with the travel time for this path segment
              // If the schedule has a travel time override, then use that instead of the default (not yet implemented)
              // In the first iteration, the travel time is zero, so we get the start_time as the current trip time.
              currentArrivalTime = incrementTime(currentArrivalTime, pathData.default_travel_time);

              // 3.2.4.4.2.6.4.
              // Increment the arrival_time for this stop with the dwell time
              // If the schedule has a dwell time override, then use that instead of the default (not yet implemented)
              const departureTime = incrementTime(currentArrivalTime, pathData.default_dwell_time);

              // 3.2.4.4.2.6.5.
              // Increment the traveled distance for this path segment with the distance delta
              currentTripDistance = currentTripDistance + pathData.distance_delta;

              // 3.2.4.4.2.6.6.
              // Write the stop_times.txt entry for this stop_time
              writeCsvToFile(progress.workdir, 'stop_times.txt', {
                trip_id: thisTripCode,
                arrival_time: currentArrivalTime,
                departure_time: departureTime,
                stop_id: stopData.code,
                stop_sequence: pathIndex,
                pickup_type: pathData.allow_pickup ? 0 : 1,
                drop_off_type: pathData.allow_drop_off ? 0 : 1,
                shape_dist_traveled: (currentTripDistance / 1000).toFixed(15),
                timepoint: 1,
              });

              // 3.2.4.4.2.6.6.
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
  // Update progress
  await update(progress, { status: 1, progress_current: 4, progress_total: 7 });

  // 4.1.
  // Fetch the referenced calendars and write the calendar_dates.txt file
  for (const calendarCode of referencedCalendarCodes) {
    const calendarData = await CalendarModel.findOne({ code: calendarCode });
    if (calendarData.dates && calendarData.dates.length) {
      const parsedCalendar = await parseCalendar(calendarData, exportOptions.start_date, exportOptions.end_date, exportOptions.concatenate_calendars);
      writeCsvToFile(progress.workdir, 'calendar_dates.txt', parsedCalendar);
    }
  }

  // 5.
  // Update progress
  await update(progress, { status: 1, progress_current: 5, progress_total: 7 });

  // 5.1.
  // Fetch the referenced stops and write the stops.txt file
  for (const stopCode of referencedStopCodes) {
    const stopData = await StopModel.findOne({ code: stopCode }).populate('municipality');
    const parsedStop = parseStop(stopData);
    writeCsvToFile(progress.workdir, 'stops.txt', parsedStop);
  }

  // 6.
  // Update progress
  await update(progress, { status: 1, progress_current: 6, progress_total: 7 });

  // 6.1.
  // Fetch the referenced fares and write the fare_attributes.txt file
  for (const fareCode of referencedFareCodes) {
    const fareData = await FareModel.findOne({ code: fareCode });
    const parsedFare = parseFare(fareData);
    writeCsvToFile(progress.workdir, 'fare_attributes.txt', parsedFare);
  }

  // 7.
  // Update progress
  await update(progress, { status: 1, progress_current: 7, progress_total: 7 });

  // 7.1.
  // Create the feed_info file
  const feedInfoData = parseFeedInfo(agencyData, exportOptions);
  writeCsvToFile(progress.workdir, 'feed_info.txt', feedInfoData);

  //
}
