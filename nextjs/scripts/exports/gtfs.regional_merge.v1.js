/* * */

import { Readable } from 'stream';
import { ExportModel } from '@/schemas/Export/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
import { ArchiveModel } from '@/schemas/Archive/model';
import { MediaModel } from '@/schemas/Media/model';
import STORAGE from '@/services/STORAGE';
import { ArchiveOptions } from '@/schemas/Archive/options';
import AdmZip from 'adm-zip';
import { DateTime } from 'luxon';
import { MunicipalityOptions } from '@/schemas/Municipality/options';
import { parse as csvParser } from 'csv-parse';
import CSVWRITER from '@/services/CSVWRITER';

//
//
//
//

/* * */
/* UPDATE PROGRESS */
/* Fetch the database for the given agency_id. */
async function update(exportDocument, updates) {
  try {
    await ExportModel.updateOne({ _id: exportDocument._id }, updates);
  } catch (error) {
    console.log(`Error at update(${exportDocument}, ${updates})`, error);
    throw new Error(`Error at update(${exportDocument}, ${updates})`);
  }
}

//
//
//
//

async function parseCsvFile(dataStream, rowParser = async () => {}) {
  const parser = csvParser({ columns: true, trim: true, skip_empty_lines: true, bom: true, record_delimiter: ['\n', '\r', '\r\n'] });
  const stream = dataStream.pipe(parser);
  for await (const rowData of stream) {
    await rowParser(rowData);
  }
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
/* PROVIDE TEMP DIRECTORY PATH */
/* Return the path for the temporary directory based on current environment. */
async function getMediaFilePath(mediaId) {
  //
  const mediaData = await MediaModel.findOne({ _id: mediaId });
  //
  return STORAGE.getFilePath(ArchiveOptions.storage_scope, `${mediaData._id}${mediaData.file_extension}`);
  //
}

//
//
//
//

function getAgencyData() {
  try {
    return {
      agency_id: 'CM',
      agency_name: 'Carris Metropolitana',
      agency_url: 'https://www.carrismetropolitana.pt',
      agency_timezone: 'Europe/Lisbon',
      agency_lang: 'pt',
      agency_phone: '210410400',
      agency_fare_url: 'https://www.carrismetropolitana.pt/tarifarios/',
      agency_email: 'contacto@carrismetropolitana.pt',
    };
  } catch (error) {
    console.log(`Error at getAgencyData()`, error);
    throw new Error(`Error at getAgencyData()`);
  }
}

function getFeedInfoData(startDateString, endDateString) {
  try {
    return {
      feed_publisher_name: 'Carris Metropolitana',
      feed_publisher_url: 'https://carrismetropolitana.pt',
      feed_lang: 'pt',
      default_lang: 'en',
      feed_contact_url: 'https://github.com/carrismetropolitana/gtfs',
      feed_version: today(),
      feed_start_date: startDateString,
      feed_end_date: endDateString,
    };
  } catch (error) {
    console.log(`Error at getFeedInfoData()`, error);
    throw new Error(`Error at getFeedInfoData()`);
  }
}

async function getStopsData() {
  try {
    let allStopsData = await StopModel.find().populate('municipality', 'code name district region').lean();
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    allStopsData = allStopsData.sort((a, b) => collator.compare(a.code, b.code));

    const allPatternsData = await PatternModel.find({}, '_id code parent_line path').populate([{ path: 'path.stop' }, { path: 'parent_line', populate: { path: 'agency' } }]);
    const allPatternsDataFormatted = allPatternsData.map((item) => ({ _id: item._id, code: item.code, agency_code: item.parent_line?.agency?.code, stop_codes: item.path?.map((pathItem) => pathItem.stop?.code) }));

    const allRegionsMap = MunicipalityOptions.region.reduce((map, { value, label }) => ((map[value] = label), map), {});
    const allDistrictsMap = MunicipalityOptions.district.reduce((map, { value, label }) => ((map[value] = label), map), {});

    return allStopsData.map((document) => {
      const thisStopAgencyCodes = Array.from(new Set(allPatternsDataFormatted.filter((item) => item.stop_codes.includes(document.code)).map((item) => item.agency_code))).join('|');
      return {
        // General
        stop_id: document.code,
        stop_name: document.name,
        stop_lat: document.latitude.toFixed(6),
        stop_lon: document.longitude.toFixed(6),
        //
        stop_code: document.code,
        stop_short_name: '', //document.short_name,
        tts_stop_name: document.tts_name,
        // Operation
        areas: thisStopAgencyCodes,
        // Administrative
        region_id: document.municipality.region,
        region_name: allRegionsMap[document.municipality.region],
        district_id: document.municipality.district,
        district_name: allDistrictsMap[document.municipality.district],
        municipality_id: document.municipality.code,
        municipality_name: document.municipality.name,
        parish_id: '',
        parish_name: '',
        locality: document.locality || '',
        jurisdiction: document.jurisdiction || '',
        // GTFS
        location_type: '0',
        platform_code: '',
        parent_station: '',
        stop_url: `https://on.carrismetropolitana.pt/stops/${document.code}`,
        // Accessibility
        wheelchair_boarding: '0',
        // Facilities
        near_health_clinic: document.near_health_clinic ? '1' : '0',
        near_hospital: document.near_hospital ? '1' : '0',
        near_university: document.near_university ? '1' : '0',
        near_school: document.near_school ? '1' : '0',
        near_police_station: document.near_police_station ? '1' : '0',
        near_fire_station: document.near_fire_station ? '1' : '0',
        near_shopping: document.near_shopping ? '1' : '0',
        near_historic_building: document.near_historic_building ? '1' : '0',
        near_transit_office: document.near_transit_office ? '1' : '0',
        // Connections
        subway: document.near_subway ? '1' : '0',
        light_rail: document.near_light_rail ? '1' : '0',
        train: document.near_train ? '1' : '0',
        boat: document.near_boat ? '1' : '0',
        airport: document.near_airport ? '1' : '0',
        bike_sharing: document.near_bike_sharing ? '1' : '0',
        bike_parking: document.near_bike_parking ? '1' : '0',
        car_parking: document.near_car_parking ? '1' : '0',
        //
      };
    });
  } catch (error) {
    console.log(`Error at getFeedInfoData()`, error);
    throw new Error(`Error at getFeedInfoData()`);
  }
}

//
//
//
//

async function readZip(zipArchive, zipEntry) {
  return new Promise((resolve, reject) => {
    try {
      console.log('> Start Read Zip', zipEntry.name);
      zipArchive.readFileAsync(zipEntry, (data, error) => {
        if (error) reject(err.message);
        // resolve(data);
        console.log('> DONE Read Zip', zipEntry.name);
        resolve(Readable.from(data));
      });
    } catch (error) {
      reject(`Error at readZip(): ${error.message}`);
    }
  });
}

//
//
//
//

/* * */
/* BUILD GTFS V29 */
/* This builds the GTFS archive. */
export default async function exportGtfsRegionalMergeV1(exportDocument, exportOptions) {
  //

  console.log(`* * *`);
  console.log(`* NEW EXPORT: REGIONAL MERGE V1`);
  console.log(`* ExportOptions:`, exportOptions);
  console.log(`* * *`);

  // 0.
  // Setup variables

  const fileWriter = new CSVWRITER('regional_merge_v1');

  // 0.
  // Update progress

  await update(exportDocument, { progress_current: 1, progress_total: 7 });

  // 1.
  // Setup the agency.txt file

  const agencyData = getAgencyData();
  await fileWriter.write(exportDocument.workdir, 'agency.txt', agencyData);

  // 2.
  // Define the date that should be used as the active date.
  // This date and the start and end dates of each archive will determine what is the
  // main plan, the currently active plan, on the export. The information contained in this active plan
  // will have precedence over other plans also included in the export.

  const currentDate = DateTime.now().startOf('day').toJSDate();
  //   const currentDate = DateTime.fromJSDate(new Date(exportOptions.current_date)).startOf('day').toJSDate();

  // 3.
  // Setup map variables to keep track of the entities included in the final plan.

  const routesMarkedForFinalExport = new Map();

  // 4.
  // Fetch all active archives from the database

  const allArchivesData = await ArchiveModel.find({ status: 'active' });

  // 5.
  // Iterate on all found archives to merge them into a single GTFS file

  for (const [archiveIndex, archiveData] of allArchivesData.entries()) {
    //

    // 5.0.
    // Update progress

    await update(exportDocument, { progress_current: archiveIndex + 1, progress_total: allArchivesData.length });

    // 5.1.
    // Setup variables to keep track of referenced entities in this archive

    const referencedCalendarDates = new Set();
    const referencedTrips = new Set();
    const referencedShapes = new Set();
    const referencedRoutes = new Set();
    const referencedStops = new Set();

    // 5.2.
    // Find out if this plan should be included in the final export, and if it is the main, currently active, plan.
    // Set the corresponding flag to be used throughout the script.

    let thisIsTheMainArchiveOfThisExport = false;

    const archiveStartDate = DateTime.fromJSDate(archiveData.start_date).startOf('day').toJSDate();
    const archiveEndDate = DateTime.fromJSDate(archiveData.end_date).startOf('day').toJSDate();

    // Skip if the archive is no longer valid
    if (currentDate > archiveEndDate) continue;

    // Archive is valid and is the one being used now
    if (currentDate > archiveStartDate && currentDate < archiveEndDate) thisIsTheMainArchiveOfThisExport = true;

    // 5.3.
    // Skip if this archive has no associated operation plan

    if (!archiveData.operation_plan) continue;

    // 5.4.
    // Retrieve the associated operation plan, saved as a Media object in STORAGE

    const operationPlanMediaFilePath = await getMediaFilePath(archiveData.operation_plan);

    // 5.5.
    // Unzip the associated operation plan

    const zipArchive = new AdmZip(operationPlanMediaFilePath);
    const zipEntries = zipArchive.getEntries();

    // 5.6.
    // Extract each entry in the zip file.

    const zipEntryCalendarDates = zipEntries.find((item) => item.entryName === 'calendar_dates.txt');
    const zipEntryTrips = zipEntries.find((item) => item.entryName === 'trips.txt');
    const zipEntryStopTimes = zipEntries.find((item) => item.entryName === 'stop_times.txt');
    const zipEntryShapes = zipEntries.find((item) => item.entryName === 'shapes.txt');
    const zipEntryRoutes = zipEntries.find((item) => item.entryName === 'routes.txt');

    // 5.7.
    // The order in which files are merged matters.
    // Since the goal of this whole operation is to merge several GTFS archives into a single one,
    // each with its own valid period, it makes sense to start with 'calendar_dates.txt' of each archive.
    // Also, each archive is huge. There is not possibility to store it all in memory and reason about its contents
    // as a whole — this has to be done line by line for each GTFS file.
    // Therefore, the dance should start by opening the calendar dates file and, for each line, check if the date
    // should be included in the final plan or not. With this information we can then go and see, for each trip,
    // if the service_id was kept or discarded. Then for the stop_times, then routes, until all files of all archives
    // are checked line by line and merged into a combined GTFS.

    try {
      //

      // 5.7.1.
      // Extract the calendar_dates.txt file from the zip archive

      const calendarDatesTxt = await readZip(zipArchive, zipEntryCalendarDates);

      // 5.7.2.
      // Decide for each date of each service ID if it should be included in the final export or not
      // If this archive is the main one, then include all dates in the plan until the end_date.
      // In other words, ignore start_date. Else, cut from the start date until the end_date.

      const parseEachRow = async (data) => {
        //
        // Parse this row's date
        const rowDateObject = DateTime.fromFormat(data.date, 'yyyyMMdd').toJSDate();
        // For the main archive, only the end_date matters
        if (thisIsTheMainArchiveOfThisExport) {
          // Skip if this row's date is after the archive's end date
          if (rowDateObject > archiveEndDate) return;
          //
        } else {
          // For all other archives, also look at start_date
          // Skip if this row's date is before the archive's start date or after the archive's end date
          if (rowDateObject < archiveStartDate || rowDateObject > archiveEndDate) return;
          //
        }
        // Format the exported row. Be very explicit to ensure the same number and order of columns.
        const exportedRowData = {
          date: data.date,
          service_id: `${data.service_id}_${archiveData.code}`,
          period: data.period,
          day_type: data.day_type,
          holiday: data.holiday,
          exception_type: data.exception_type,
        };
        // Include this date in the final export and save a reference to the current service_id
        await fileWriter.write(exportDocument.workdir, 'calendar_dates.txt', exportedRowData);
        referencedCalendarDates.add(data.service_id);
        //
      };

      // 5.7.3.
      // Setup the CSV parsing operation

      await parseCsvFile(calendarDatesTxt, parseEachRow);

      console.log(`> Done with calendar_dates.txt of archive ${archiveData.code}`);

      //
    } catch (error) {
      console.log('Error processing calendar_dates.txt file.', error);
      throw new Error('Error processing calendar_dates.txt file.');
    }

    // 5.8.
    // Next up: trips.txt
    // Now that the calendars are sorted out, the jobs is easier for the trips.
    // Only include trips which have the referenced service IDs saved before.

    try {
      //

      // 5.8.1.
      // Extract the trips.txt file from the zip archive

      const tripsTxt = await readZip(zipArchive, zipEntryTrips);

      // 5.8.2.
      // For each trip, check if the associated service_id was saved in the previous step or not.
      // Include it if yes, skip otherwise.

      const parseEachRow = async (data) => {
        //
        // Skip if this row's service_id was not saved before
        if (!referencedCalendarDates.has(data.service_id)) return;
        // Format the exported row. Be very explicit to ensure the same number and order of columns.
        const exportedRowData = {
          route_id: data.route_id,
          pattern_id: `${data.pattern_id}_${archiveData.code}`,
          service_id: `${data.service_id}_${archiveData.code}`,
          trip_id: `${data.trip_id}_${archiveData.code}`,
          trip_headsign: data.trip_headsign,
          direction_id: data.direction_id,
          shape_id: `${data.shape_id}_${archiveData.code}`,
          calendar_desc: data.calendar_desc,
        };
        // Include this trip in the final export and save a reference to the current trip_id
        await fileWriter.write(exportDocument.workdir, 'trips.txt', exportedRowData);
        referencedTrips.add(data.trip_id);
        referencedShapes.add(data.shape_id);
        referencedRoutes.add(data.route_id);
        //
      };

      // 5.7.3.
      // Setup the CSV parsing operation

      await parseCsvFile(tripsTxt, parseEachRow);

      console.log(`> Done with trips.txt of archive ${archiveData.code}`);

      //
    } catch (error) {
      console.log('Error processing trips.txt file.', error);
      throw new Error('Error processing trips.txt file.');
    }

    // 5.9.
    // Next up: stop_times.txt
    // Do a similiar check as the previous step. Only include the stop_times for trips referenced before.

    try {
      //

      // 5.9.1.
      // Extract the stop_times.txt file from the zip archive

      const stopTimesTxt = await readZip(zipArchive, zipEntryStopTimes);

      // 5.9.2.
      // For each stop of each trip, check if the associated trip_id was saved in the previous step or not.
      // Include it if yes, skip otherwise.

      const parseEachRow = async (data) => {
        //
        // Skip if this row's trip_id was not saved before
        if (!referencedTrips.has(data.trip_id)) return;
        // Format the exported row. Be very explicit to ensure the same number and order of columns.
        const exportedRowData = {
          trip_id: `${data.trip_id}_${archiveData.code}`,
          arrival_time: data.arrival_time,
          departure_time: data.departure_time,
          stop_id: data.stop_id,
          stop_sequence: data.stop_sequence,
          pickup_type: data.pickup_type,
          drop_off_type: data.drop_off_type,
          shape_dist_traveled: data.shape_dist_traveled,
          timepoint: data.timepoint,
        };
        // Include this trip in the final export and save a reference to the current trip_id
        await fileWriter.write(exportDocument.workdir, 'stop_times.txt', exportedRowData);
        referencedStops.add(data.stop_id);
        //
      };

      // 5.9.3.
      // Setup the CSV parsing operation

      await parseCsvFile(stopTimesTxt, parseEachRow);

      console.log(`> Done with stop_times.txt of archive ${archiveData.code}`);

      //
    } catch (error) {
      console.log('Error processing stop_times.txt file.', error);
      throw new Error('Error processing stop_times.txt file.');
    }

    // 5.10.
    // Next up: shapes.txt
    // Do a similiar check as the previous step. Only include the shapes for trips referenced before.

    try {
      //

      // 5.10.1.
      // Extract the shapes.txt file from the zip archive

      const shapesTxt = await readZip(zipArchive, zipEntryShapes);

      // 5.10.2.
      // For each point of each shape, check if the shape_id was saved in the previous step or not.
      // Include it if yes, skip otherwise.

      const parseEachRow = async (data) => {
        //
        // Skip if this row's trip_id was not saved before
        if (!referencedShapes.has(data.shape_id)) return;
        // Format the exported row. Be very explicit to ensure the same number and order of columns.
        const exportedRowData = {
          shape_id: `${data.shape_id}_${archiveData.code}`,
          shape_pt_sequence: data.shape_pt_sequence,
          shape_pt_lat: data.shape_pt_lat,
          shape_pt_lon: data.shape_pt_lon,
          shape_dist_traveled: data.shape_dist_traveled,
        };
        // Include this trip in the final export and save a reference to the current trip_id
        await fileWriter.write(exportDocument.workdir, 'shapes.txt', exportedRowData);
        //
      };

      // 5.10.3.
      // Setup the CSV parsing operation

      await parseCsvFile(shapesTxt, parseEachRow);

      console.log(`> Done with shapes.txt of archive ${archiveData.code}`);

      //
    } catch (error) {
      console.log('Error processing shapes.txt file.', error);
      throw new Error('Error processing shapes.txt file.');
    }

    // 5.11.
    // Next up: routes.txt
    // Do a similiar check as the previous step, with a few modifications. Only include routes referenced before,
    // but do not add the archive code modifier to the route_id. This a stylisitc choice that impacts how routes
    // can and should be stored. Instead of relying on an archive-scoped variable to keep track of what was referenced,
    // an export-scoped variable is required. Also, the same route can only be exported once, but it can be present
    // in multiple archives. This is why nothing is exported in this block, as it is only used as a way to signal
    // that each route should be exported or not, based on certain conditions.

    try {
      //

      // 5.11.1.
      // Extract the routes.txt file from the zip archive

      const routesTxt = await readZip(zipArchive, zipEntryRoutes);

      // 5.11.2.
      // For each route, decide if it should be marked for export or not.
      // Priority is given to routes in the main archive, which is to say that name, color and other attributes
      // for a given route, if included in multiple archives, the one from the main archive will be the exported one.
      // Also, if a route was not saved for a particular archive, we can skip it right away. There is no need to include it
      // if it has no valid trips. In fact, doing so is a formal GTFS warning, and should be avoided.

      const parseEachRow = async (data) => {
        //
        // Skip if this row's route_id was not saved before
        if (!referencedRoutes.has(data.route_id)) return;
        // Format the exported row. Be very explicit to ensure the same number and order of columns.
        const exportedRowData = {
          line_id: data.line_id,
          line_short_name: data.line_short_name,
          line_long_name: data.line_long_name,
          line_type: data.line_type,
          route_id: data.route_id,
          agency_id: agencyData.agency_id,
          route_short_name: data.route_short_name,
          route_long_name: data.route_long_name,
          route_type: data.route_type,
          path_type: data.path_type,
          circular: data.circular,
          school: data.school,
          route_color: data.route_color,
          route_text_color: data.route_text_color,
        };
        // Save or replace this route if this is the main export,
        // or save it if this route was not yet found in previous archives.
        if (thisIsTheMainArchiveOfThisExport || !routesMarkedForFinalExport.has(data.route_id)) {
          // Mark this route for export
          routesMarkedForFinalExport.set(data.route_id, exportedRowData);
          //
        }
        //
      };

      // 5.11.3.
      // Setup the CSV parsing operation

      await parseCsvFile(routesTxt, parseEachRow);

      console.log(`> Done with routes.txt of archive ${archiveData.code}`);

      //
    } catch (error) {
      console.log('Error processing routes.txt file.', error);
      throw new Error('Error processing routes.txt file.');
    }

    //
  }

  // 6.
  // After exporting each archive-specific file, handle exporting routes.

  const routesMarkedForFinalExportData = Array.from(routesMarkedForFinalExport.values());
  await fileWriter.write(exportDocument.workdir, 'routes.txt', routesMarkedForFinalExportData);

  // 7.
  // Export stops file

  const allStopsData = await getStopsData();
  await fileWriter.write(exportDocument.workdir, 'stops.txt', allStopsData);

  // 8.
  // Finally setup the feed_info.txt file

  const feedInfoData = getFeedInfoData('20240101', '20241231');
  await fileWriter.write(exportDocument.workdir, 'feed_info.txt', feedInfoData);

  await fileWriter.flush();

  //
}
