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

	const agencyData = await AgencyModel.findOne({ _id: { $eq: exportOptions.agency_id } });

	console.log(`* * *`);
	console.log(`* SLA Default v1 : NEW EXPORT`);
	console.log(`* AgencyData:`, agencyData);
	console.log(`* ExportOptions:`, exportOptions);
	console.log(`* * *`);

	// 0.
	// Update progress
	await update(progress, { progress_current: 1, progress_total: 2 });

	// 1.
	// Get all stops from the database

	const allTripAnalysisStream = await SLAMANAGERDB.TripAnalysis.find({ agency_id: agencyData.code, operational_day: { $gte: exportOptions.start_date, $lte: exportOptions.end_date } }).stream();

	const defaultCsvWriter = new CSVWRITER('reports.sla.dump-default');

	// 3.
	// Parse each stop and format it according to the GTFS-TML specification

	for await (const tripAnalysisData of allTripAnalysisStream) {
		//

		const tripAnalysisParsed = {
			//
			code: tripAnalysisData.code,
			//
			archive_id: tripAnalysisData.archive_id,
			agency_id: tripAnalysisData.agency_id,
			operational_day: tripAnalysisData.operational_day,
			line_id: tripAnalysisData.line_id,
			route_id: tripAnalysisData.route_id,
			pattern_id: tripAnalysisData.pattern_id,
			trip_id: tripAnalysisData.trip_id,
			service_id: tripAnalysisData.service_id,
			//
			user_notes: tripAnalysisData.user_notes,
			//
		};

		tripAnalysisData.analysis.forEach((item) => {
			tripAnalysisParsed[`${item.code}-status`] = item.status;
			tripAnalysisParsed[`${item.code}-grade`] = item.grade;
			tripAnalysisParsed[`${item.code}-reason`] = item.reason;
			tripAnalysisParsed[`${item.code}-message`] = item.message;
		});

		await defaultCsvWriter.write(progress.workdir, progress.filename, tripAnalysisParsed);

		//
	}

	await defaultCsvWriter.flush();

	// 0.
	// Update progress
	await update(progress, { progress_current: 2, progress_total: 2 });

	//
}
