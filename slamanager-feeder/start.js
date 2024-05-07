/* * */

const OFFERMANAGERDB = require('./services/OFFERMANAGERDB');
const SLAMANAGERDB = require('./services/SLAMANAGERDB');
const TIMETRACKER = require('./services/TIMETRACKER');
const DBWRITER = require('./services/DBWRITER');
const { DateTime } = require('luxon');
const AdmZip = require('adm-zip');
const { Readable } = require('stream');
const { parse: csvParser } = require('csv-parse');
const crypto = require('crypto');

/* * */

module.exports = async () => {
  //

  try {
    console.log();
    console.log('------------------------');
    console.log(new Date().toISOString());
    console.log('------------------------');
    console.log();

    const globalTimer = new TIMETRACKER();
    console.log('Starting...');

    // 1.
    // Connect to databases

    console.log();
    console.log('→ Connecting to databases...');

    await OFFERMANAGERDB.connect();
    await SLAMANAGERDB.connect();

    // 2.
    // Setup database writers

    const uniqueTripsDbWritter = new DBWRITER('UniqueTrip', SLAMANAGERDB.UniqueTrip);
    const uniqueShapesDbWritter = new DBWRITER('UniqueShape', SLAMANAGERDB.UniqueShape);
    const tripAnalysisDbWritter = new DBWRITER('TripAnalysis', SLAMANAGERDB.TripAnalysis);

    // 3.
    // Setup variables to keep track of created IDs

    const createdUniqueTripCodes = new Set();
    const createdUniqueShapeCodes = new Set();
    const createdTripAnalysisCodes = new Set();

    // 4.
    // Get all archives (GTFS plans) from GO database, and iterate on each one

    const allArchivesData = await OFFERMANAGERDB.Archive.find({ status: 'active', slamanager_feeder_status: 'waiting' }).toArray();

    for (const [archiveIndex, archiveData] of allArchivesData.entries()) {
      try {
      //

      // 4.1.
      // Skip if this archive has no associated operation plan

      if (!archiveData.operation_plan) continue;

      // 4.2.
      // Setup variables to save formatted entities found in this archive

      const savedCalendarDates = new Map();
      const savedTrips = new Map();
      const savedStops = new Map();
      const savedRoutes = new Map();
      const savedShapes = new Map();
      const savedStopTimes = new Map();

      const referencedStops = new Set();
      const referencedShapes = new Set();
      const referencedRoutes = new Set();

      // 4.3.
      // Get the associated start and end dates for this archive.
      // Even though most operation plans (GTFS files) will be annual, as in having calendar_dates for a given year,
      // they are valid only on a given set of days, usually one month. Therefore we have multiple annual plans, each one
      // valid on a different month. The validity dates will be used to clip the calendars and only saved the actual part
      // of the plan that was actually active in that period.

      const archiveStartDate = DateTime.fromJSDate(archiveData.start_date).startOf('day').toJSDate();
      const archiveEndDate = DateTime.fromJSDate(archiveData.end_date).startOf('day').toJSDate();
      const todayDate = DateTime.now().startOf('day').toJSDate();

      // 4.4.
      // Unzip the associated operation plan

      const zipArchive = new AdmZip(`../nextjs/storage/archives/${archiveData.operation_plan.toString()}.zip`);
      const zipEntries = zipArchive.getEntries();

      // 4.5.
      // Setup each zip entry.

      const zipEntryCalendarDates = zipEntries.find((item) => item.entryName === 'calendar_dates.txt');
      const zipEntryTrips = zipEntries.find((item) => item.entryName === 'trips.txt');
      const zipEntryStopTimes = zipEntries.find((item) => item.entryName === 'stop_times.txt');
      const zipEntryShapes = zipEntries.find((item) => item.entryName === 'shapes.txt');
      const zipEntryRoutes = zipEntries.find((item) => item.entryName === 'routes.txt');
      const zipEntryStops = zipEntries.find((item) => item.entryName === 'stops.txt');

      // 4.6.
      // Log progress

      console.log();
      console.log(`[${archiveIndex + 1}/${allArchivesData.length}] Plan ${archiveData.code} | start_date: ${archiveStartDate.toISOString()} | end_date: ${archiveEndDate.toISOString()}`);
      console.log();

      // The order of execution matters when parsing each file. This is because archives are valid on a set of dates.
      // By first parsing calendar_dates.txt, we know exactly which service_ids "were active" in the set of dates.
      // Then when parsing trips.txt, only trips that belong to those service_ids will be included. And so on, for each file.
      // By having a list of trips we can extract only the necessary info from the other files, and thus reducing significantly
      // the amount of information to be checked.

      // 4.7.
      // Extract calendar_dates.txt and filter only service_ids valid between the given archive start_date and end_date.

      try {
        //

        // 4.7.1.
        // Extract the calendar_dates.txt file from the zip archive

        const calendarDatesTxt = await readZip(zipArchive, zipEntryCalendarDates);

        // 4.7.2.
        // Parse each row, and save only the matching servic_ids

        const parseEachRow = async (data) => {
          //
          // Parse this row's date
          const rowDateObject = DateTime.fromFormat(data.date, 'yyyyMMdd').toJSDate();
          // Skip if this row's date is before the archive's start date or after the archive's end date
          if (rowDateObject < archiveStartDate || rowDateObject > archiveEndDate || rowDateObject > todayDate) return;
          // Get the previously saved calendar
          const savedCalendar = savedCalendarDates.get(data.service_id);
          //
          if (savedCalendar) {
            // If this service_id was previously saved, add the current date to it
            savedCalendarDates.set(data.service_id, Array.from(new Set([...savedCalendar, data.date])));
          } else {
            // If this is the first time we're seeing this service_id, initiate the dates array with the current date
            savedCalendarDates.set(data.service_id, [data.date]);
          }
          //
        };

        // 4.7.3.
        // Setup the CSV parsing operation

        await parseCsvFile(calendarDatesTxt, parseEachRow);

        console.log(`✔︎ Finished processing "calendar_dates.txt" of archive "${archiveData.code}".`);

        //
      } catch (error) {
        console.log('✖︎ Error processing "calendar_dates.txt" file.', error);
        throw new Error('✖︎ Error processing "calendar_dates.txt" file.');
      }

      // 4.8.
      // Next up: trips.txt
      // Now that the calendars are sorted out, the jobs is easier for the trips.
      // Only include trips which have the referenced service IDs saved before.

      try {
        //

        // 4.8.1.
        // Extract the trips.txt file from the zip archive

        const tripsTxt = await readZip(zipArchive, zipEntryTrips);

        // 4.8.2.
        // For each trip, check if the associated service_id was saved in the previous step or not.
        // Include it if yes, skip otherwise.

        const parseEachRow = async (data) => {
          //
          // Skip if this row's service_id was not saved before
          if (!savedCalendarDates.has(data.service_id)) return;
          // Format the exported row. Only include the minimum required to prevent memory bloat later on.
          const parsedRowData = {
            trip_id: data.trip_id,
            trip_headsign: data.trip_headsign,
            route_id: data.route_id,
            pattern_id: data.pattern_id,
            service_id: data.service_id,
            shape_id: data.shape_id,
          };
          // Save this trip for later
          savedTrips.set(data.trip_id, parsedRowData);
          // Reference the route_id and shape_id to filter them later
          referencedRoutes.add(data.route_id);
          referencedShapes.add(data.shape_id);
          //
        };

        // 4.8.3.
        // Setup the CSV parsing operation

        await parseCsvFile(tripsTxt, parseEachRow);

        console.log(`✔︎ Finished processing "trips.txt" of archive "${archiveData.code}".`);

        //
      } catch (error) {
        console.log('✖︎ Error processing "trips.txt" file.', error);
        throw new Error('✖︎ Error processing "trips.txt" file.');
      }

      // 4.9.
      // Next up: routes.txt
      // For routes, only include the ones referenced in the filtered trips.

      try {
        //

        // 4.9.1.
        // Extract the routes.txt file from the zip archive

        const routesTxt = await readZip(zipArchive, zipEntryRoutes);

        // 4.9.2.
        // For each route, only save the ones referenced by previously saved trips.

        const parseEachRow = async (data) => {
          //
          // Skip if this row's route_id was not saved before
          if (!referencedRoutes.has(data.route_id)) return;
          // Format the exported row
          const parsedRowData = {
            route_id: data.route_id,
            route_short_name: data.route_short_name,
            route_long_name: data.route_long_name,
            route_color: data.route_color,
            route_text_color: data.route_text_color,
            line_id: data.line_id,
            line_short_name: data.line_short_name,
            line_long_name: data.line_long_name,
            agency_id: data.agency_id,
          };
          //
          savedRoutes.set(data.route_id, parsedRowData);
          //
        };

        // 4.9.3.
        // Setup the CSV parsing operation

        await parseCsvFile(routesTxt, parseEachRow);

        console.log(`✔︎ Finished processing "routes.txt" of archive "${archiveData.code}".`);

        //
      } catch (error) {
        console.log('✖︎ Error processing "routes.txt" file.', error);
        throw new Error('✖︎ Error processing "routes.txt" file.');
      }

      // 4.10.
      // Next up: shapes.txt
      // Do a similiar check as the previous step. Only include the shapes for trips referenced before.

      try {
        //

        // 4.10.1.
        // Extract the shapes.txt file from the zip archive

        const shapesTxt = await readZip(zipArchive, zipEntryShapes);

        // 4.10.2.
        // For each point of each shape, check if the shape_id was referenced by valid trips.

        const parseEachRow = async (data) => {
          //
          // Skip if this row's trip_id was not saved before
          if (!referencedShapes.has(data.shape_id)) return;
          //
          const thisShapeRowPoint = {
            shape_pt_sequence: Number(data.shape_pt_sequence),
            shape_pt_lat: data.shape_pt_lat,
            shape_pt_lon: data.shape_pt_lon,
          };
          // Get the previously saved shape
          const savedShape = savedShapes.get(data.shape_id);
          //
          if (savedShape) {
            // If this shape_id was previously saved, add the current point to it
            savedShapes.set(data.shape_id, [...savedShape, thisShapeRowPoint]);
          } else {
            // If this is the first time we're seeing this shape_id, initiate the points array with the current point
            savedShapes.set(data.shape_id, [thisShapeRowPoint]);
          }
          //
        };

        // 4.10.3.
        // Setup the CSV parsing operation

        await parseCsvFile(shapesTxt, parseEachRow);

        console.log(`✔︎ Finished processing "shapes.txt" of archive "${archiveData.code}".`);

        //
      } catch (error) {
        console.log('✖︎ Error processing "shapes.txt" file.', error);
        throw new Error('✖︎ Error processing "shapes.txt" file.');
      }

      // 4.11.
      // Next up: stops.txt
      // For stops, include all of them since we don't have a way to filter them yet like trips/routes/shapes.
      // By saving all of them, we also speed up the processing of each stop_time by including the stop data right away.

      try {
        //

        // 4.11.1.
        // Extract the stops.txt file from the zip archive

        const stopsTxt = await readZip(zipArchive, zipEntryStops);

        // 4.11.2.
        // Save all stops, but only the mininum required data.

        const parseEachRow = async (data) => {
          //
          const parsedRowData = {
            stop_id: data.stop_id,
            stop_lat: data.stop_lat,
            stop_lon: data.stop_lon,
            stop_name: data.stop_name,
          };
          //
          savedStops.set(data.stop_id, parsedRowData);
          //
        };

        // 4.11.3.
        // Setup the CSV parsing operation

        await parseCsvFile(stopsTxt, parseEachRow);

        console.log(`✔︎ Finished processing "stops.txt" of archive "${archiveData.code}".`);

        //
      } catch (error) {
        console.log('✖︎ Error processing "stops.txt" file.', error);
        throw new Error('✖︎ Error processing "stops.txt" file.');
      }

      // 4.12.
      // Next up: stop_times.txt
      // Do a similiar check as the previous steps. Only include the stop_times for trips referenced before.
      // Since this is the most resource intensive operation of them all, include the associated stop data
      // right away to avoid another lookup later.

      try {
        //

        // 4.12.1.
        // Extract the stop_times.txt file from the zip archive

        const stopTimesTxt = await readZip(zipArchive, zipEntryStopTimes);

        // 4.12.2.
        // For each stop of each trip, check if the associated trip_id was saved in the previous step or not.
        // Save valid stop times along with the associated stop data.

        const parseEachRow = async (data) => {
          //
          // Skip if this row's trip_id was not saved before
          if (!savedTrips.has(data.trip_id)) return;
          // Get the associated stop data. Skip if none found.
          const stopData = savedStops.get(data.stop_id);
          if (!stopData) return;
          //
          const parsedRowData = {
            stop_id: data.stop_id,
            stop_lat: stopData.stop_lat,
            stop_lon: stopData.stop_lon,
            stop_name: stopData.stop_name,
            arrival_time: data.arrival_time,
            departure_time: data.departure_time,
            stop_sequence: Number(data.stop_sequence),
            pickup_type: data.pickup_type,
            drop_off_type: data.drop_off_type,
            timepoint: data.timepoint,
          };
          //
          const savedStopTime = savedStopTimes.get(data.trip_id);
          //
          if (savedStopTime) {
            savedStopTimes.set(data.trip_id, [...savedStopTime, parsedRowData]);
          } else {
            savedStopTimes.set(data.trip_id, [parsedRowData]);
          }
          //
          referencedStops.add(data.stop_id);
          //
        };

        // 4.12.3.
        // Setup the CSV parsing operation

        await parseCsvFile(stopTimesTxt, parseEachRow);

        console.log(`✔︎ Finished processing "stop_times.txt" of archive "${archiveData.code}".`);

        //
      } catch (error) {
        console.log('✖︎ Error processing "stop_times.txt" file.', error);
        throw new Error('✖︎ Error processing "stop_times.txt" file.');
      }

      // 4.13.
      // Transform each trip object into the database format, and save it to the database.
      // Combine the previously extracted info from all files into a single object.

      try {
        //

        for (const tripData of savedTrips.values()) {
          //

          // 4.13.1.
          // Get associated data

          const calendarDatesData = savedCalendarDates.get(tripData.service_id);
          const stopTimesData = savedStopTimes.get(tripData.trip_id);
          const routeData = savedRoutes.get(tripData.route_id);
          const shapeData = savedShapes.get(tripData.shape_id);

          // 4.13.2.
          // Setup the unique trip data

          const uniqueTripData = {
            //
            agency_id: routeData.agency_id,
            //
            line_id: routeData.line_id,
            line_short_name: routeData.line_short_name,
            line_long_name: routeData.line_long_name,
            //
            route_id: tripData.route_id,
            route_short_name: routeData.route_short_name,
            route_long_name: routeData.route_long_name,
            route_color: routeData.route_color,
            route_text_color: routeData.route_text_color,
            //
            pattern_id: tripData.pattern_id,
            trip_headsign: tripData.trip_headsign,
            //
            path: stopTimesData?.sort((a, b) => a.stop_sequence - b.stop_sequence),
            //
          };

          // 4.13.3.
          // Hash the unique trip contents to prevent duplicates
          // Check if this unique trip already exists. If it does not exist, save it to the database.

          uniqueTripData.code = crypto.createHash('sha256').update(JSON.stringify(uniqueTripData)).digest('hex');
          const currentSpineAlreadyExists = await SLAMANAGERDB.UniqueTrip.findOne({ code: uniqueTripData.code });
          if (!currentSpineAlreadyExists) await uniqueTripsDbWritter.write(uniqueTripData);
          createdUniqueTripCodes.add(uniqueTripData.code);

          // 4.13.4.
          // Setup the unique shape data

          const uniqueShapeData = {
            agency_id: routeData.agency_id,
            shape_id: tripData.shape_id,
            points: shapeData?.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence),
          };

          // 4.13.5.
          // Hash the unique shape contents to prevent duplicates
          // Check if this unique shape already exists. If it does not exist, save it to the database.

          uniqueShapeData.code = crypto.createHash('sha256').update(JSON.stringify(uniqueShapeData)).digest('hex');
          const currentShapeAlreadyExists = await SLAMANAGERDB.UniqueShape.findOne({ code: uniqueShapeData.code });
          if (!currentShapeAlreadyExists) await uniqueShapesDbWritter.write(uniqueShapeData);
          createdUniqueShapeCodes.add(uniqueShapeData.code);

          // 4.13.6.
          // Create a trip analysis document for each day this trip is scheduled to run

          for (const calendarDate of calendarDatesData) {
            //
            const tripAnalysisData = {
              //
              code: `${archiveData.code}-${routeData.agency_id}-${calendarDate}-${tripData.trip_id}`,
              //
              status: 'waiting',
              //
              plan_id: archiveData.code,
              agency_id: routeData.agency_id,
              operational_day: calendarDate,
              line_id: routeData.line_id,
              route_id: routeData.route_id,
              pattern_id: tripData.pattern_id,
              trip_id: tripData.trip_id,
              service_id: tripData.service_id,
              //
              unique_trip_code: uniqueTripData.code,
              unique_shape_code: uniqueShapeData.code,
              //
              parse_timestamp: new Date(),
              analysis_timestamp: null,
              //
              analysis: [],
              //
              user_notes: '',
              //
            };
            //
            await tripAnalysisDbWritter.write(tripAnalysisData);
            //
            createdTripAnalysisCodes.add(tripAnalysisData.code);
            //
          }

          // 4.13.7.
          // Delete the current trip to free up memory sooner

          savedTrips.delete(tripData.trip_id);
          savedStopTimes.delete(tripData.trip_id);

          //
        }

        await uniqueTripsDbWritter.flush();
        await uniqueShapesDbWritter.flush();
        await tripAnalysisDbWritter.flush();

        //
      } catch (error) {
        console.log('✖︎ Error transforming or saving shapes to database.', error);
        throw new Error('✖︎ Error transforming or saving shapes to database.');
      }

      //

      await OFFERMANAGERDB.Archive.updateOne({ code: archiveData.code }, { $set: { slamanager_feeder_status: 'processed' } });

      //

      console.log(`✔︎ Finished processing archive ${archiveData.code}`);
      console.log();
      console.log('- - - - - - - - - - - - - - - - - - - - -');

    } catch (error) {
      console.log(`✖︎ Error processing archive ${archiveData.code}`, error);
      await OFFERMANAGERDB.Archive.updateOne({ code: archiveData.code }, { $set: { slamanager_feeder_status: 'error' } });
    }

      //
    }

    // console.log();
    // console.log('→ Deleting stale entries...');

    // const staleUniqueTripCodes = [];
    // const existingUniqueTripCodes = await SLAMANAGERDB.UniqueTrip.find({}, 'code').stream();
    // for await (const existingUniqueTripData of existingUniqueTripCodes) {
    //   if (!createdUniqueTripCodes.has(existingUniqueTripData.code)) staleUniqueTripCodes.push(existingUniqueTripData.code);
    // }
    // const deletedUniqueTripEntries = await SLAMANAGERDB.UniqueTrip.deleteMany({ code: { $in: staleUniqueTripCodes } });

    // const staleUniqueShapeCodes = [];
    // const existingUniqueShapeCodes = await SLAMANAGERDB.UniqueShape.find({}, 'code').stream();
    // for await (const existingUniqueShapeData of existingUniqueShapeCodes) {
    //   if (!createdUniqueShapeCodes.has(existingUniqueShapeData.code)) staleUniqueShapeCodes.push(existingUniqueShapeData.code);
    // }
    // const deletedUniqueShapeEntries = await SLAMANAGERDB.UniqueShape.deleteMany({ code: { $in: staleUniqueShapeCodes } });

    // const staleTripAnalysisCodes = [];
    // const existingTripAnalysisCodes = await SLAMANAGERDB.TripAnalysis.find({}, 'code').stream();
    // for await (const existingTripAnalysisData of existingTripAnalysisCodes) {
    //   if (!createdTripAnalysisCodes.has(existingTripAnalysisData.code)) staleTripAnalysisCodes.push(existingTripAnalysisData.code);
    // }
    // const deletedTripAnalysisEntries = await SLAMANAGERDB.TripAnalysis.deleteMany({ code: { $in: staleTripAnalysisCodes } });

    // console.log(`✔︎ Deleted stale entries: UniqueTrip: ${deletedUniqueTripEntries.deletedCount} | UniqueShape: ${deletedUniqueShapeEntries.deletedCount} | TripAnalysis: ${deletedTripAnalysisEntries.deletedCount}`);
    // console.log();

    //

    console.log();
    console.log('- - - - - - - - - - - - - - - - - - - - -');
    console.log(`Run took ${globalTimer.get()}.`);
    console.log('- - - - - - - - - - - - - - - - - - - - -');
    console.log();

    process.exit(0);

    //
  } catch (err) {
    console.log('✖︎ An error occurred. Halting execution.', err);
    console.log('✖︎ Retrying in 10 seconds...');
    setTimeout(() => {
      process.exit(0); // End process
    }, 10000); // after 10 seconds
  }

  //
};

/* * */

async function readZip(zipArchive, zipEntry) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`→ Reading zip entry "${zipEntry.name}"...`);
      zipArchive.readFileAsync(zipEntry, (data, error) => {
        if (error) reject(error.message);
        console.log(`→ Done read zip entry "${zipEntry.name}".`);
        resolve(Readable.from(data));
      });
    } catch (error) {
      reject(`✖︎ Error at readZip(): ${error.message}`);
    }
  });
}

/* * */

async function parseCsvFile(dataStream, rowParser = async () => {}) {
  const parser = csvParser({ columns: true, trim: true, skip_empty_lines: true, bom: true, record_delimiter: ['\n', '\r', '\r\n'] });
  const stream = dataStream.pipe(parser);
  for await (const rowData of stream) {
    await rowParser(rowData);
  }
}
