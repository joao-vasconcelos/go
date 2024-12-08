/* * */

import { AgencyModel } from '@/schemas/Agency/model';
import { ExportModel } from '@/schemas/Export/model';
import CSVWRITER from '@/services/CSVWRITER';
import { rides } from '@tmlmobilidade/services/interfaces';

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

	const ridesCollection = await rides.getCollection();
	const allRidesStream = ridesCollection.find({ agency_id: agencyData.code, operational_date: { $gte: exportOptions.start_date, $lte: exportOptions.end_date } }).stream();

	const defaultCsvWriter = new CSVWRITER('reports.sla.dump-default', { batch_size: 10000 });

	const outputFileName = `SLA_${agencyData.code}_${exportOptions.start_date}_${exportOptions.end_date}.csv`;

	// 3.
	// Parse each stop and format it according to the GTFS-TML specification

	for await (const rideData of allRidesStream) {
		//

		const rideParsed = {
			...rideData,
			analysis: undefined,
			hashed_shape_id: undefined,
			hashed_trip_id: undefined,
		};

		rideData.analysis.forEach((item) => {
			rideParsed[`${item._id}-grade`] = item.grade;
			rideParsed[`${item._id}-reason`] = item.reason;
			rideParsed[`${item._id}-message`] = item.message;
			rideParsed[`${item._id}-unit`] = item.unit;
			rideParsed[`${item._id}-value`] = item.value;
		});

		await defaultCsvWriter.write(progress.workdir, outputFileName, rideParsed);

		//
	}

	await defaultCsvWriter.flush();

	// 0.
	// Update progress
	await update(progress, { progress_current: 2, progress_total: 2 });

	//
}
