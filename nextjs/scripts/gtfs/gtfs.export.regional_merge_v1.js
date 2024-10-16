/* * */

import { ArchiveModel } from '@/schemas/Archive/model';
import { ArchiveOptions } from '@/schemas/Archive/options';
import { ExportModel } from '@/schemas/Export/model';
import { MediaModel } from '@/schemas/Media/model';
import datesExportDefault from '@/scripts/dates/dates.export.default';
import faresExportAttributes from '@/scripts/fares/fares.export.attributes';
import faresExportRules from '@/scripts/fares/fares.export.rules';
import municipalitiesExportDefault from '@/scripts/municipalities/municipalities.export.default';
import periodsExportDefault from '@/scripts/periods/periods.export.default';
import stopsExportDefault from '@/scripts/stops/stops.export.default';
import CSVWRITER from '@/services/CSVWRITER';
import STORAGE from '@/services/STORAGE';
import { parse as csvParser } from 'csv-parse';
import extract from 'extract-zip';
import fs from 'fs';
import { DateTime } from 'luxon';

/* * */

async function unzipFile(zipFilePath, outputDir) {
	await extract(zipFilePath, { dir: outputDir });
	setDirectoryPermissions(outputDir);
}

/* * */

const setDirectoryPermissions = (dirPath, mode = 0o666) => {
	const files = fs.readdirSync(dirPath, { withFileTypes: true });
	for (const file of files) {
		const filePath = `${dirPath}/${file.name}`;
		if (file.isDirectory()) {
			setDirectoryPermissions(filePath, mode);
		}
		else {
			fs.chmodSync(filePath, mode);
		}
	}
};

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
	}
	catch (error) {
		console.log(`Error at update(${exportDocument}, ${updates})`, error);
		throw new Error(`Error at update(${exportDocument}, ${updates})`);
	}
}

//
//
//
//

async function parseCsvFile(filePath, rowParser = async () => null) {
	const parser = csvParser({ bom: true, columns: true, record_delimiter: ['\n', '\r', '\r\n'], skip_empty_lines: true, trim: true });
	const fileStream = fs.createReadStream(filePath);
	const stream = fileStream.pipe(parser);
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
	let currentDate = new Date();
	let year = currentDate.getFullYear();
	let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
	let day = currentDate.getDate().toString().padStart(2, '0');
	let hours = currentDate.getHours().toString().padStart(2, '0');
	let minutes = currentDate.getMinutes().toString().padStart(2, '0');

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
	return STORAGE.getFilePath(ArchiveOptions.storage_scope, `${mediaData._id}${mediaData.file_extension.toLowerCase()}`);
	//
}

/* * */

function getAgencyData() {
	return {
		agency_email: 'contacto@carrismetropolitana.pt',
		agency_fare_url: 'https://www.carrismetropolitana.pt/tarifarios/',
		agency_id: 'CM',
		agency_lang: 'pt',
		agency_name: 'Carris Metropolitana',
		agency_phone: '210410400',
		agency_timezone: 'Europe/Lisbon',
		agency_url: 'https://www.carrismetropolitana.pt',
	};
}

/* * */

function getFeedInfoData(startDateString, endDateString) {
	try {
		return {
			default_lang: 'en',
			feed_contact_url: 'https://api.carrismetropolitana.pt/gtfs',
			feed_end_date: endDateString,
			feed_lang: 'pt',
			feed_publisher_name: 'Carris Metropolitana',
			feed_publisher_url: 'https://carrismetropolitana.pt',
			feed_start_date: startDateString,
			feed_version: today(),
		};
	}
	catch (error) {
		console.log(`Error at getFeedInfoData()`, error);
		throw new Error(`Error at getFeedInfoData()`);
	}
}

/* * */

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

	const todayDateString = exportOptions.active_date || DateTime.now().startOf('day').toFormat('yyyyMMdd');

	// 3.
	// Setup map variables to keep track of the entities included in the final plan.

	const routesMarkedForFinalExport = new Map();

	// 4.
	// Fetch all active archives from the database

	const allArchivesData = await ArchiveModel.find({ status: 'active' }).populate('agency');

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

		// Skip if the archive is no longer valid
		if (todayDateString > archiveData.end_date) continue;

		// Archive is valid and is the one being used now
		if (todayDateString >= archiveData.start_date && todayDateString <= archiveData.end_date) thisIsTheMainArchiveOfThisExport = true;

		// 5.3.
		// Skip if this archive has no associated operation plan

		if (!archiveData.operation_plan) continue;

		// 5.4.
		// Retrieve the associated operation plan, saved as a Media object in STORAGE

		const operationPlanMediaFilePath = await getMediaFilePath(archiveData.operation_plan);
		const extractDirPath = `${process.env.APP_TMP_DIR}/extractions/${Math.floor(Math.random() * 1000)}/${exportDocument._id}`;

		// 5.5.
		// Unzip the associated operation plan

		await unzipFile(operationPlanMediaFilePath, extractDirPath);

		// 5.6.
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

			// 5.6.1.
			// Decide for each date of each service ID if it should be included in the final export or not
			// If this archive is the main one, then include all dates in the plan until the end_date.
			// In other words, ignore start_date. Else, cut from the start date until the end_date.

			const parseEachRow = async (data) => {
				//
				// For the main archive, only the end_date matters
				if (thisIsTheMainArchiveOfThisExport) {
					// Skip if this row's date is after the archive's end date
					if (data.date > archiveData.end_date) return;
					//
				}
				else {
					// For all other archives, also look at start_date
					// Skip if this row's date is before the archive's start date or after the archive's end date
					if (data.date < archiveData.start_date || data.date > archiveData.end_date) return;
					//
				}
				// Format the exported row. Be very explicit to ensure the same number and order of columns.
				const exportedRowData = {
					date: data.date,
					day_type: data.day_type,
					exception_type: data.exception_type,
					holiday: data.holiday,
					period: data.period,
					service_id: `${data.service_id}_${archiveData.code}`,
				};
					// Include this date in the final export and save a reference to the current service_id
				await fileWriter.write(exportDocument.workdir, 'calendar_dates.txt', exportedRowData);
				referencedCalendarDates.add(data.service_id);
				//
			};

			// 5.6.2.
			// Setup the CSV parsing operation

			await parseCsvFile(`${extractDirPath}/calendar_dates.txt`, parseEachRow);

			console.log(`> Done with calendar_dates.txt of archive ${archiveData.code}`);

			//
		}
		catch (error) {
			console.log('Error processing calendar_dates.txt file.', error);
			throw new Error('Error processing calendar_dates.txt file.');
		}

		// 5.7.
		// Next up: trips.txt
		// Now that the calendars are sorted out, the jobs is easier for the trips.
		// Only include trips which have the referenced service IDs saved before.

		try {
			//

			// 5.7.1.
			// For each trip, check if the associated service_id was saved in the previous step or not.
			// Include it if yes, skip otherwise.

			const parseEachRow = async (data) => {
				//
				// Skip if this row's service_id was not saved before
				if (!referencedCalendarDates.has(data.service_id)) return;
				// Format the exported row. Be very explicit to ensure the same number and order of columns.
				const exportedRowData = {
					calendar_desc: data.calendar_desc,
					direction_id: data.direction_id,
					pattern_id: data.pattern_id,
					route_id: data.route_id,
					service_id: `${data.service_id}_${archiveData.code}`,
					shape_id: `${data.shape_id}_${archiveData.code}`,
					trip_headsign: data.trip_headsign,
					trip_id: `${data.trip_id}_${archiveData.code}`,
				};
					// Include this trip in the final export
				await fileWriter.write(exportDocument.workdir, 'trips.txt', exportedRowData);
				// Save a reference to the current trip_id, shape_id and route_id
				referencedTrips.add(data.trip_id);
				referencedShapes.add(data.shape_id);
				referencedRoutes.add(data.route_id);
				//
			};

			// 5.7.2.
			// Setup the CSV parsing operation

			await parseCsvFile(`${extractDirPath}/trips.txt`, parseEachRow);

			console.log(`> Done with trips.txt of archive ${archiveData.code}`);

			//
		}
		catch (error) {
			console.log('Error processing trips.txt file.', error);
			throw new Error('Error processing trips.txt file.');
		}

		// 5.8.
		// Next up: stop_times.txt
		// Do a similiar check as the previous step. Only include the stop_times for trips referenced before.

		try {
			//

			// 5.8.1.
			// For each stop of each trip, check if the associated trip_id was saved in the previous step or not.
			// Include it if yes, skip otherwise.

			const parseEachRow = async (data) => {
				//
				// Skip if this row's trip_id was not saved before
				if (!referencedTrips.has(data.trip_id)) return;
				// Format the exported row. Be very explicit to ensure the same number and order of columns.
				const exportedRowData = {
					arrival_time: data.arrival_time,
					departure_time: data.departure_time,
					drop_off_type: '0', // data.drop_off_type,
					pickup_type: '0', // data.pickup_type,
					shape_dist_traveled: data.shape_dist_traveled,
					stop_id: data.stop_id,
					stop_sequence: data.stop_sequence,
					timepoint: data.timepoint,
					trip_id: `${data.trip_id}_${archiveData.code}`,
				};
					// Include this trip in the final export and save a reference to the current trip_id
				await fileWriter.write(exportDocument.workdir, 'stop_times.txt', exportedRowData);
				referencedStops.add(data.stop_id);
				//
			};

			// 5.8.2.
			// Setup the CSV parsing operation

			await parseCsvFile(`${extractDirPath}/stop_times.txt`, parseEachRow);

			console.log(`> Done with stop_times.txt of archive ${archiveData.code}`);

			//
		}
		catch (error) {
			console.log('Error processing stop_times.txt file.', error);
			throw new Error('Error processing stop_times.txt file.');
		}

		// 5.9.
		// Next up: shapes.txt
		// Do a similiar check as the previous step. Only include the shapes for trips referenced before.

		try {
			//

			// 5.9.1.
			// For each point of each shape, check if the shape_id was saved in the previous step or not.
			// Include it if yes, skip otherwise.

			const parseEachRow = async (data) => {
				//
				// Skip if this row's trip_id was not saved before
				if (!referencedShapes.has(data.shape_id)) return;
				// Format the exported row. Be very explicit to ensure the same number and order of columns.
				const exportedRowData = {
					shape_dist_traveled: data.shape_dist_traveled,
					shape_id: `${data.shape_id}_${archiveData.code}`,
					shape_pt_lat: data.shape_pt_lat,
					shape_pt_lon: data.shape_pt_lon,
					shape_pt_sequence: data.shape_pt_sequence,
				};
					// Include this trip in the final export and save a reference to the current trip_id
				await fileWriter.write(exportDocument.workdir, 'shapes.txt', exportedRowData);
				//
			};

			// 5.9.2.
			// Setup the CSV parsing operation

			await parseCsvFile(`${extractDirPath}/shapes.txt`, parseEachRow);

			console.log(`> Done with shapes.txt of archive ${archiveData.code}`);

			//
		}
		catch (error) {
			console.log('Error processing shapes.txt file.', error);
			throw new Error('Error processing shapes.txt file.');
		}

		// 5.10.
		// Next up: routes.txt
		// Do a similiar check as the previous step, with a few modifications. Only include routes referenced before,
		// but do not add the archive code modifier to the route_id. This a stylisitc choice that impacts how routes
		// can and should be stored. Instead of relying on an archive-scoped variable to keep track of what was referenced,
		// an export-scoped variable is required. Also, the same route can only be exported once, but it can be present
		// in multiple archives. This is why nothing is exported in this block, as it is only used as a way to signal
		// that each route should be exported or not, based on certain conditions.

		try {
			//

			// 5.10.1.
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
					agency_id: agencyData.agency_id,
					circular: data.circular,
					line_id: data.line_id,
					line_long_name: data.line_long_name,
					line_short_name: data.line_short_name,
					line_type: data.line_type,
					path_type: data.path_type,
					route_color: data.route_color,
					route_id: data.route_id,
					route_long_name: data.route_long_name,
					route_short_name: data.route_short_name,
					route_text_color: data.route_text_color,
					route_type: data.route_type,
					school: data.school,
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

			// 5.10.2.
			// Setup the CSV parsing operation

			await parseCsvFile(`${extractDirPath}/routes.txt`, parseEachRow);

			console.log(`> Done with routes.txt of archive ${archiveData.code}`);

			//
		}
		catch (error) {
			console.log('Error processing routes.txt file.', error);
			throw new Error('Error processing routes.txt file.');
		}

		// 5.11.
		// Add the current archive to the list of archives that this export is made of.

		try {
			//

			const exportedRowData = {
				archive_end_date: archiveData.end_date,
				archive_id: archiveData.code,
				archive_start_date: archiveData.start_date,
				operator_id: archiveData.agency?.code || 'N/A',
			};

			await fileWriter.write(exportDocument.workdir, 'archives.txt', exportedRowData);

			console.log(`> Done with archives.txt entry for archive ${archiveData.code}`);

			//
		}
		catch (error) {
			console.log('Error processing archives.txt file.', error);
			throw new Error('Error processing archives.txt file.');
		}

		//
	}

	// 6.
	// After exporting each archive-specific file, handle exporting routes.

	const routesMarkedForFinalExportData = Array.from(routesMarkedForFinalExport.values());
	await fileWriter.write(exportDocument.workdir, 'routes.txt', routesMarkedForFinalExportData);

	// 7.
	// Export stops file

	const allStopsExportedData = await stopsExportDefault();
	await fileWriter.write(exportDocument.workdir, 'stops.txt', allStopsExportedData);

	// 8.
	// Export fare rules and fare attributes files

	const lineCodesMarkedForFinalExport = Array.from(new Set(Array.from(routesMarkedForFinalExport.values()).map(item => item.line_id)));
	const routeCodesMarkedForFinalExport = Array.from(new Set(Array.from(routesMarkedForFinalExport.values()).map(item => item.route_id)));
	const allFareRulesExportData = await faresExportRules({ line_codes: lineCodesMarkedForFinalExport, route_codes: routeCodesMarkedForFinalExport });
	await fileWriter.write(exportDocument.workdir, 'fare_rules.txt', allFareRulesExportData);

	const fareCodesMarkedForFinalExport = Array.from(new Set(Array.from(allFareRulesExportData.values()).map(item => item.fare_id)));
	const allFareAttributesExportData = await faresExportAttributes({ fare_codes: fareCodesMarkedForFinalExport });
	await fileWriter.write(exportDocument.workdir, 'fare_attributes.txt', allFareAttributesExportData);

	// 9.
	// Export municipalities file

	const allMunicipalitiesExportedData = await municipalitiesExportDefault();
	await fileWriter.write(exportDocument.workdir, 'municipalities.txt', allMunicipalitiesExportedData);

	// 9.
	// Export dates file

	const allDatesExportedData = await datesExportDefault();
	await fileWriter.write(exportDocument.workdir, 'dates.txt', allDatesExportedData);

	// 9.
	// Export periods file

	const allPeriodsExportedData = await periodsExportDefault();
	await fileWriter.write(exportDocument.workdir, 'periods.txt', allPeriodsExportedData);

	// 10.
	// Export feed_info.txt file

	const lowestArchiveStartDate = allArchivesData.reduce((min, { start_date }) => start_date < min ? start_date : min, allArchivesData[0].start_date);
	const highestArchiveEndDate = allArchivesData.reduce((max, { end_date }) => end_date > max ? end_date : max, allArchivesData[0].end_date);

	const feedInfoData = getFeedInfoData(lowestArchiveStartDate, highestArchiveEndDate);
	await fileWriter.write(exportDocument.workdir, 'feed_info.txt', feedInfoData);

	// 11.
	// Do the final cleanup. Flush all pending writes to the exported files and cleanup extract directory.

	await fileWriter.flush();

	//
}
