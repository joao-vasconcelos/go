/* eslint-disable perfectionist/sort-objects */

/* * */

import { AgencyModel } from '@/schemas/Agency/model';
import { ExportModel } from '@/schemas/Export/model';
import SLAMANAGERBUFFERDB from '@/services/SLAMANAGERBUFFERDB';
import { CsvWriter } from '@helperkits/writer';

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

export default async function reportsSlaExportDebug(progress, exportOptions) {
	//

	await SLAMANAGERBUFFERDB.connect();

	const agencyData = await AgencyModel.findOne({ _id: { $eq: exportOptions.agency_id } });

	console.log(`* * *`);
	console.log(`* SLA Debug v1 : NEW EXPORT`);
	console.log(`* AgencyData:`, agencyData);
	console.log(`* ExportOptions:`, exportOptions);
	console.log(`* * *`);

	// 1.
	// Dump Vehicle Events

	await update(progress, { progress_current: 1, progress_total: 3 });

	const allBufferedVehicleEventsStream = SLAMANAGERBUFFERDB.BufferData.find({ type: 'vehicle_event', agency_id: agencyData.code, operational_day: exportOptions.debug_date }).stream();

	const vehicleEventsOutputFilePath = `${progress.workdir}/SLA_DEBUG_${agencyData.code}_${exportOptions.debug_date}_vehicle_events.csv`;

	const vehicleEventsCsvWriter = new CsvWriter('vehicle_event', vehicleEventsOutputFilePath, { batch_size: 1000000 });

	for await (const bufferDocumentData of allBufferedVehicleEventsStream) {
		await vehicleEventsCsvWriter.write({
			timestamp: bufferDocumentData.timestamp,
			type: bufferDocumentData.type,
			operational_day: bufferDocumentData.operational_day,
			agency_id: bufferDocumentData.agency_id,
			original_id: bufferDocumentData.original_id,
			pcgi_id: bufferDocumentData.pcgi_id,
			line_id: bufferDocumentData.line_id,
			route_id: bufferDocumentData.route_id,
			pattern_id: bufferDocumentData.pattern_id,
			trip_id: bufferDocumentData.trip_id,
			stop_id: bufferDocumentData.stop_id,
			vehicle_id: bufferDocumentData.vehicle_id,
			odometer: bufferDocumentData.odometer,
		});
	}

	await vehicleEventsCsvWriter.flush();

	// 2.
	// Dump Validation Transactions

	await update(progress, { progress_current: 2, progress_total: 3 });

	const allBufferedValidationTransactionsStream = SLAMANAGERBUFFERDB.BufferData.find({ type: 'validation_transaction', agency_id: agencyData.code, operational_day: exportOptions.debug_date }).stream();

	const validationTransactionsOutputFilePath = `${progress.workdir}/SLA_DEBUG_${agencyData.code}_${exportOptions.debug_date}_validation_transactions.csv`;

	const validationTransactionsCsvWriter = new CsvWriter('validation_transaction', validationTransactionsOutputFilePath, { batch_size: 1000000 });

	for await (const bufferDocumentData of allBufferedValidationTransactionsStream) {
		await validationTransactionsCsvWriter.write({
			timestamp: bufferDocumentData.timestamp,
			type: bufferDocumentData.type,
			operational_day: bufferDocumentData.operational_day,
			agency_id: bufferDocumentData.agency_id,
			original_id: bufferDocumentData.original_id,
			pcgi_id: bufferDocumentData.pcgi_id,
			line_id: bufferDocumentData.line_id,
			route_id: bufferDocumentData.route_id,
			pattern_id: bufferDocumentData.pattern_id,
			trip_id: bufferDocumentData.trip_id,
			stop_id: bufferDocumentData.stop_id,
			vehicle_id: bufferDocumentData.vehicle_id,
			device_id: bufferDocumentData.device_id,
		});
	}

	await validationTransactionsCsvWriter.flush();

	// 3.
	// Dump Location Transactions

	await update(progress, { progress_current: 2, progress_total: 3 });

	const allBufferedLocationTransactionsStream = SLAMANAGERBUFFERDB.BufferData.find({ type: 'location_transaction', agency_id: agencyData.code, operational_day: exportOptions.debug_date }).stream();

	const locationTransactionsOutputFilePath = `${progress.workdir}/SLA_DEBUG_${agencyData.code}_${exportOptions.debug_date}_location_transactions.csv`;

	const locationTransactionsCsvWriter = new CsvWriter('location_transaction', locationTransactionsOutputFilePath, { batch_size: 1000000 });

	for await (const bufferDocumentData of allBufferedLocationTransactionsStream) {
		await locationTransactionsCsvWriter.write({
			timestamp: bufferDocumentData.timestamp,
			type: bufferDocumentData.type,
			operational_day: bufferDocumentData.operational_day,
			agency_id: bufferDocumentData.agency_id,
			original_id: bufferDocumentData.original_id,
			pcgi_id: bufferDocumentData.pcgi_id,
			line_id: bufferDocumentData.line_id,
			route_id: bufferDocumentData.route_id,
			pattern_id: bufferDocumentData.pattern_id,
			trip_id: bufferDocumentData.trip_id,
			stop_id: bufferDocumentData.stop_id,
			vehicle_id: bufferDocumentData.vehicle_id,
			device_id: bufferDocumentData.device_id,
		});
	}

	await locationTransactionsCsvWriter.flush();

	//
}
