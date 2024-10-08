/* eslint-disable perfectionist/sort-objects */

/* * */

import { AgencyModel } from '@/schemas/Agency/model';
import { ExportModel } from '@/schemas/Export/model';
import CSVWRITER from '@/services/CSVWRITER';
import SLAMANAGERDB from '@/services/SLAMANAGERDB';

/* * */

async function update(exportDocument, updates) {
	try {
		await ExportModel.updateOne({ _id: exportDocument._id }, updates);
	}
	catch (error) {
		console.log(`Error at update(${exportDocument}, ${updates})`, error);
		throw new Error(`Error at update(${exportDocument}, ${updates})`);
	}
}

/* * */

export default async function reportsSlaExportDefault(progress, exportOptions) {
	//

	await SLAMANAGERDB.connect();

	console.log(`* * *`);
	console.log(`* SLA Publish v1 : NEW EXPORT`);
	console.log(`* ExportOptions:`, exportOptions);
	console.log(`* * *`);

	// 0.
	// Update progress
	await update(progress, { progress_current: 1, progress_total: 2 });

	// 1.
	// Get all stops from the database

	const allTripAnalysisStream = SLAMANAGERDB.TripAnalysis.find({ operational_day: { $gte: exportOptions.start_date, $lte: exportOptions.end_date } }).stream();

	const defaultCsvWriter = new CSVWRITER('reports.sla.publish_v1', { batch_size: 10000 });

	const outputFileName = `SLA_PUBLISH_v1_${exportOptions.start_date}_${exportOptions.end_date}.csv`;

	// 3.
	// Parse each stop and format it according to the GTFS-TML specification

	const resultMap = new Map();

	for await (const tripAnalysisData of allTripAnalysisStream) {
		//

		if (!resultMap.has(`${tripAnalysisData.operational_day}-${tripAnalysisData.line_id}`)) {
			resultMap.set(`${tripAnalysisData.operational_day}-${tripAnalysisData.line_id}`, {
				agency_id: tripAnalysisData.agency_id,
				line_id: tripAnalysisData.line_id,
				operational_day: tripAnalysisData.operational_day,
				total_trip_count: 0,
				pass_trip_count: 0,
			});
		}

		resultMap.get(`${tripAnalysisData.operational_day}-${tripAnalysisData.line_id}`).total_trip_count += 1;

		const simpleOneValidationTransactionTest = tripAnalysisData.analysis.find(item => item.code === 'SIMPLE_ONE_VALIDATION_TRANSACTION');
		const simpleThreeVehicleEventsTest = tripAnalysisData.analysis.find(item => item.code === 'SIMPLE_THREE_VEHICLE_EVENTS');

		if ((simpleOneValidationTransactionTest && simpleOneValidationTransactionTest.grade === 'PASS') || (simpleThreeVehicleEventsTest && simpleThreeVehicleEventsTest.grade === 'PASS')) {
			resultMap.get(`${tripAnalysisData.operational_day}-${tripAnalysisData.line_id}`).pass_trip_count += 1;
		}

		//
	}

	for (const resultElem of resultMap.values()) {
		const parsedWithPercentage = {
			...resultElem,
			pass_trip_percentage: resultElem.pass_trip_count / resultElem.total_trip_count,
		};
		await defaultCsvWriter.write(progress.workdir, outputFileName, parsedWithPercentage);
	}

	//

	await defaultCsvWriter.flush();

	// 0.
	// Update progress

	await update(progress, { progress_current: 2, progress_total: 2 });

	//
}
