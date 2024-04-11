/* * */

import Papa from 'papaparse';
import fs, { write } from 'fs';
import calculateDateDayType from '@/services/calculateDateDayType';
import { ExportModel } from '@/schemas/Export/model';
import { LineModel } from '@/schemas/Line/model';
import { FareModel } from '@/schemas/Fare/model';
import { TypologyModel } from '@/schemas/Typology/model';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { MunicipalityModel } from '@/schemas/Municipality/model';
import { ZoneModel } from '@/schemas/Zone/model';
import { StopModel } from '@/schemas/Stop/model';
import { DateModel } from '@/schemas/Date/model';
import { CalendarModel } from '@/schemas/Calendar/model';
import { ArchiveModel } from '@/schemas/Archive/model';
import { MediaModel } from '@/schemas/Media/model';
import STORAGE from '@/services/STORAGE';
import SMTP from '@/services/SMTP';
import { ArchiveOptions } from '@/schemas/Archive/options';
import AdmZip from 'adm-zip';
import { DateTime } from 'luxon';

/* * */
/* MERGE GTFS */
/* This endpoint returns a zip file. */
/* * */

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

/* * */
/* WRITE CSV TO FILE */
/* Parse and append data to an existing file. */
function writeCsvToFile(workdir, filename, data, papaparseOptions) {
  try {
    // Set the new line character to be used (should be \n)
    const newLineCharacter = '\n';
    // If data is not an array, then wrap it in one
    if (!Array.isArray(data)) data = [data];
    // Check if the file already exists
    const fileExists = fs.existsSync(`${workdir}/${filename}`);
    // Use papaparse to produce the CSV string
    let csvData = Papa.unparse(data, { skipEmptyLines: 'greedy', newline: newLineCharacter, header: !fileExists, ...papaparseOptions });
    // Prepend a new line character to csvData string if it is not the first line on the file
    if (fileExists) csvData = newLineCharacter + csvData;
    // Append the csv string to the file
    fs.appendFileSync(`${workdir}/${filename}`, csvData);
    //
  } catch (error) {
    console.log(`Error at writeCsvToFile(${workdir}, ${filename}, ${data}, ${papaparseOptions})`, error);
    throw new Error(`Error at writeCsvToFile(${workdir}, ${filename}, ${data}, ${papaparseOptions})`);
  }
}

//
//
//
//

/* * */
/* PROVIDE TEMP DIRECTORY PATH */
/* Return the path for the temporary directory based on current environment. */
function getWorkdir() {
  // Use the 'tmp' folder as the working directory
  const workdir = `${process.env.PWD}/merges/1234`;
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

function getFeedInfoData() {
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
    console.log(`Error at getFeedInfoData()`, error);
    throw new Error(`Error at getFeedInfoData()`);
  }
}

//
//
//
//

/* * */
/* BUILD GTFS V29 */
/* This builds the GTFS archive. */
export default async function exportGtfsRegionalMergeV1(progress, exportOptions) {
  //

  console.log(`* * *`);
  console.log(`* NEW EXPORT: REGIONAL MERGE V1`);
  console.log(`* ExportOptions:`, exportOptions);
  console.log(`* * *`);

  // 0.
  // Update progress

  await update(progress, { progress_current: 1, progress_total: 7 });

  // 1.
  // Define the date that should be used as the active date.
  // This date and the start and end dates of each archive will determine what is the
  // main plan, the currently active plan, on the export. The information contained in this active plan
  // will have precedence over other plans also included in the export.

  const currentDate = DateTime.now().startOf('day').toJSDate();
  //   const currentDate = DateTime.fromJSDate(new Date(exportOptions.current_date)).startOf('day').toJSDate();

  // 2.
  // Setup the agency.txt and feed_info.txt files, which are static files.
  // Multiple agencies (41, 42, 43, 44, etc.) will be merged in the CM agency.

  const agencyData = getAgencyData();
  writeCsvToFile(progress.workdir, 'agency.csv', agencyData);

  const feedInfoData = getFeedInfoData();
  writeCsvToFile(progress.workdir, 'feed_info.csv', feedInfoData);

  // 3.
  // Setup map variables to keep track of the entities included in the final plan.

  const referencedRoutes = new Map();

  // 4.
  // Fetch all active archives from the database

  const allArchivesData = await ArchiveModel.find({ status: 'active' });

  // 5.
  // Iterate on all found archives to merge them into a single GTFS file

  for (const archiveData of allArchivesData) {
    //

    // 5.1.
    // Update progress

    await update(progress, { progress_current: 2 });

    // 5.2.
    // Find out if this plan should be included in the final export, and if it is the main, currently active, plan.
    // Set the corresponding flag to be used throughout the script.

    let isthisArchiveValidToday = false;

    const archiveStartDate = DateTime.fromISO(archiveData.start_date).startOf('day').toJSDate();
    const archiveEndDate = DateTime.fromISO(archiveData.end_date).startOf('day').toJSDate();

    // Plan is no longer valid
    if (archiveEndDate < currentDate) continue;

    // Plan is valid and is the one being used now
    if (archiveStartDate < currentDate < archiveEndDate) isthisArchiveValidToday = true;

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
    // The order of the merged files matters.
    // Extract each entry in the zip file and check if it is valid.

    const zipEntryRoutes = zipEntries.find((item) => item.entryName === 'routes.txt');
    const zipEntryTrips = zipEntries.find((item) => item.entryName === 'trips.txt');
    const zipEntryStopTimes = zipEntries.find((item) => item.entryName === 'stop_times.txt');
    const zipEntryCalendarDates = zipEntries.find((item) => item.entryName === 'calendar_dates.txt');

    // 5.7.
    // Parse the 'routes.txt' file

    try {
      const routesTxt = zipEntryRoutes.getData().toString('utf8');
      const routesData = Papa.parse(routesTxt, { header: true, skipEmptyLines: true, dynamicTyping: false });

      for (const routeEntry of routesData.data) {
        //

        const formattedRouteEntry = { ...routeEntry, route_id: routeEntry.route_id };

        // Check if this route was already included in the plan or not
        if (referencedRoutes.get(routeEntry.route_id)) {
          // If it was, then check if this archive is the current one.
          // If it is, then replace the route definition for this plan.
          if (isthisArchiveValidToday) referencedRoutes.set(routeEntry.route_id, formattedRouteEntry);
          else continue;
        } else {
          referencedRoutes.set(routeEntry.route_id, formattedRouteEntry);
        }

        //
      }
    } catch (error) {
      console.log('Error processing routes.txt file.', error);
    }

    // 5.8.
    // Parse the 'trips.txt' file

    try {
      const tripsTxt = zipEntryTrips.getData().toString('utf8');
      const tripsData = Papa.parse(tripsTxt, { header: true, skipEmptyLines: true, dynamicTyping: false });
      for (const tripEntry of tripsData.data) {
        const formattedTripEntry = { ...tripEntry, trip_id: `${archiveData.code}_${tripEntry.trip_id}`, service_id: `${archiveData.code}_${tripEntry.service_id}` };
        writeCsvToFile(progress.workdir, 'trips.csv', formattedTripEntry);
      }
    } catch (error) {
      console.log('Error processing trips.txt file.', error);
    }

    // 5.8.
    // Parse the 'stop_times.txt' file

    try {
      const stopTimesTxt = zipEntryStopTimes.getData().toString('utf8');
      const stopTimesData = Papa.parse(stopTimesTxt, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        step: function (row) {
          console.log('Row:', row.data);
        },
        complete: function () {
          console.log('All done!');
        },
      });

      for (const stopTimeEntry of stopTimesData.data) {
        const formattedStopTimeEntry = { ...stopTimeEntry, trip_id: `${archiveData.code}_${stopTimeEntry.trip_id}` };
        writeCsvToFile(progress.workdir, 'stop_times.csv', formattedStopTimeEntry);
      }
    } catch (error) {
      console.log('Error processing stop_times.txt file.', error);
    }

    return;

    // 5.8.
    // Parse the 'calendar_dates.txt' file

    try {
      const calendarDatesTxt = zipEntryCalendarDates.getData().toString('utf8');
      const calendarDatesData = Papa.parse(calendarDatesTxt, { header: true, skipEmptyLines: true, dynamicTyping: false });

      for (const calendarDateEntry of calendarDatesData.data) {
        //

        // if this archive is active today, then include all dates in the plan until the end_date (ignore start_date)
        // if this archive is not the active today, then cut from the start date until the end_date

        if (isthisArchiveValidToday) {
          // Check if the
        }

        const formattedCalendarDateEntry = { ...calendarDateEntry, service_id: `${archiveData.code}_${calendarDateEntry.service_id}` };
        writeCsvToFile(progress.workdir, 'calendar_dates.csv', formattedCalendarDateEntry);
      }
    } catch (error) {
      console.log('Error processing calendar_dates.txt file.', error);
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
}
