/* * */

import PCGIDB from '@/services/PCGIDB.js';
import SLAMANAGERBUFFERDB from '@/services/SLAMANAGERBUFFERDB.js';
import SLAMANAGERDB from '@/services/SLAMANAGERDB.js';
import LOGGER from '@helperkits/logger';
import TIMETRACKER from '@helperkits/timer';
import { MongoDbWriter } from '@helperkits/writer';
import { DateTime } from 'luxon';

/* * */

const BUFFER_MIN_DATE = '20240601';
const BUFFER_MAX_DATE = '20240630';
const BUFFER_DAYS_DELAY = 3;

/* * */

async function setOperationalDayStatus(operationalDay: string, documentType: string, status: boolean) {
	await SLAMANAGERBUFFERDB.OperationalDayStatus.updateOne({ operational_day: operationalDay }, { $set: { [`${documentType}_synced`]: status, operational_day: operationalDay } }, { upsert: true });
}

/* * */

async function syncDocuments(documentType: string, operationalDay: string, pcgiCollection, bufferCollection, pcgiQuery, bufferQuery, pcgiDocumentTransform, dbWriter: MongoDbWriter) {
	//

	LOGGER.divider();

	const syncTimer = new TIMETRACKER();

	LOGGER.info(`Syncing "${documentType}" documents for "${operationalDay}"...`);

	//
	// Count the number of document in each database

	const pcgiCountTimer = new TIMETRACKER();
	const pcgiCountValue = await pcgiCollection.countDocuments(pcgiQuery);
	LOGGER.info(`Found ${pcgiCountValue} "${documentType}" documents in PCGIDB for "${operationalDay}" (${pcgiCountTimer.get()})`);

	const bufferCountTimer = new TIMETRACKER();
	const bufferCountValue = await bufferCollection.countDocuments(bufferQuery);
	LOGGER.info(`Found ${bufferCountValue} "${documentType}" documents in SLAMANAGERBUFFERDB for "${operationalDay}" (${bufferCountTimer.get()})`);

	if (pcgiCountValue === bufferCountValue) {
		await setOperationalDayStatus(operationalDay, documentType, true);
		LOGGER.success(`All "${documentType}" documents for "${operationalDay}" are already in sync (${syncTimer.get()})`);
		return;
	}
	else {
		await setOperationalDayStatus(operationalDay, documentType, false);
		LOGGER.error(`Document count between databases did not match. Starting sync for "${documentType}" documents for "${operationalDay}"...`);
	}

	//
	// Fetch all existing Document IDs from SLAMANAGERBUFFERDB

	const bufferDocumentsTimer = new TIMETRACKER();

	const bufferDocumentsSet = new Set();

	const bufferDocumentsStream = bufferCollection.find(bufferQuery).stream();

	for await (const bufferDocument of bufferDocumentsStream) {
		bufferDocumentsSet.add(String(bufferDocument.original_id));
	}

	LOGGER.info(`Fetched ${bufferDocumentsSet.size} "${documentType}" document IDs in SLAMANAGERBUFFERDB for "${operationalDay}" (${bufferDocumentsTimer.get()})`);

	//
	// Fetch documents from PCGIDB

	const pcgiDocumentsTimer = new TIMETRACKER();

	const pcgiDocumentsStream = pcgiCollection.find(pcgiQuery).stream();

	let pcgiDocumentsCounter = 0;

	for await (const pcgiDocument of pcgiDocumentsStream) {
		// Skip document if already present in SLAMANAGERBUFFERDB
		if (bufferDocumentsSet.has(String(pcgiDocument._id))) {
			continue;
		}
		// If not yet present, add it to SLAMANAGERBUFFERDB
		pcgiDocumentsCounter++;
		const formattedObject = pcgiDocumentTransform(pcgiDocument);
		await dbWriter.write(formattedObject, { filter: { original_id: formattedObject.original_id }, upsert: true });
		//
	}

	await dbWriter.flush();

	LOGGER.success(`Added ${pcgiDocumentsCounter} "${documentType}" documents from PCGIDB to SLAMANAGERBUFFERDB for operational_day "${operationalDay}" (${pcgiDocumentsTimer.get()})`);

	//

	await setOperationalDayStatus(operationalDay, documentType, true);

	LOGGER.success(`Synced all "${documentType}" documents between PCGIDB and SLAMANAGERBUFFERDB for operational_day "${operationalDay}" (${syncTimer.get()})`);

	//
}

/* * */

export default async () => {
	try {
		//

		LOGGER.init();

		const globalTimer = new TIMETRACKER();

		// 1.
		// Connect to databases

		LOGGER.info('Connecting to databases...');

		await SLAMANAGERDB.connect();
		await SLAMANAGERBUFFERDB.connect();
		await PCGIDB.connect();

		const bufferDataDbWritter = new MongoDbWriter('BufferData', SLAMANAGERBUFFERDB.BufferData, { batch_size: 100000 });

		LOGGER.divider();

		// 2.
		// Get all existing operational days, even ones that are already buffered

		const allOperationalDays = await SLAMANAGERDB.TripAnalysis.distinct('operational_day');

		LOGGER.info(`Found ${allOperationalDays.length} operational days. Checking each one...`);

		// 3.
		// Iterate on each day

		for (const [operationalDayIndex, operationalDay] of allOperationalDays.entries()) {
			//

			LOGGER.divider();

			const operationalDayTimer = new TIMETRACKER();

			// 3.1.
			// Skip this day if it is outside the allowed buffer range

			if (operationalDay < BUFFER_MIN_DATE || operationalDay > BUFFER_MAX_DATE) {
				LOGGER.success(`[${operationalDayIndex + 1}/${allOperationalDays.length}] Skipping operational_day "${operationalDay}" as it is outside the allowed buffer range (${BUFFER_MIN_DATE} - ${BUFFER_MAX_DATE}).`);
				continue;
			}

			// 3.2.
			// Skip this day if it is after the current date minus 2 days

			const todayMinusTwoDays = DateTime.now().minus({ days: BUFFER_DAYS_DELAY }).toFormat('yyyyMMdd');

			if (operationalDay > todayMinusTwoDays) {
				LOGGER.error(`[${operationalDayIndex + 1}/${allOperationalDays.length}] Skipping operational_day "${operationalDay}" as it is after the current date (${todayMinusTwoDays}).`);
				continue;
			}

			//

			LOGGER.info(`[${operationalDayIndex + 1}/${allOperationalDays.length}] Checking sync status for operational_day "${operationalDay}"...`);

			// 3.3.
			// Convert operational day into required formats

			const operationalDayStart = DateTime.fromFormat(operationalDay, 'yyyyMMdd').set({ hour: 4, minute: 0, second: 0 });
			const operationalDayEnd = DateTime.fromFormat(operationalDay, 'yyyyMMdd').plus({ day: 1 }).set({ hour: 3, minute: 59, second: 59 });

			const operationalDayStartMillis = operationalDayStart.toMillis();
			const operationalDayEndMillis = operationalDayEnd.toMillis();

			const operationalDayStartString = operationalDayStart.toFormat('yyyy-LL-dd\'T\'HH\':\'mm\':\'ss');
			const operationalDayEndString = operationalDayEnd.toFormat('yyyy-LL-dd\'T\'HH\':\'mm\':\'ss');

			// 3.4.
			// Syncronize Vehicle Events

			try {
				//

				const pcgiVehicleEventsQuery = {
					'content.entity.vehicle.trip.tripId': { $exists: true },
					'millis': { $gte: operationalDayStartMillis, $lte: operationalDayEndMillis },
				};

				const bufferVehicleEventsQuery = {
					operational_day: operationalDay,
					type: 'vehicle_event',
				};

				const pcgiVehicleEventsDocumentTransform = (pcgiDocument) => {
					return {
						agency_id: pcgiDocument.content.entity[0].vehicle.agencyId,
						data: JSON.stringify(pcgiDocument),
						line_id: pcgiDocument.content.entity[0].vehicle.trip.lineId,
						operational_day: operationalDay,
						original_id: String(pcgiDocument._id),
						pattern_id: pcgiDocument.content.entity[0].vehicle.trip.patternId,
						route_id: pcgiDocument.content.entity[0].vehicle.trip.routeId,
						stop_id: pcgiDocument.content.entity[0].vehicle.trip.stopId,
						timestamp: DateTime.fromSeconds(pcgiDocument.content.entity[0].vehicle.timestamp).toMillis(),
						trip_id: pcgiDocument.content.entity[0].vehicle.trip.tripId,
						type: 'vehicle_event',
					};
				};

				await syncDocuments('vehicle_event', operationalDay, PCGIDB.VehicleEvents, SLAMANAGERBUFFERDB.BufferData, pcgiVehicleEventsQuery, bufferVehicleEventsQuery, pcgiVehicleEventsDocumentTransform, bufferDataDbWritter);

				//
			}
			catch (error) {
				LOGGER.error(`Error syncing Vehicle Events for "${operationalDay}".`, error);
			}

			await bufferDataDbWritter.flush();

			// 3.5.
			// Syncronize Validation Transactions

			try {
				//

				const pcgiValidationTransactionsQuery = {
					'transaction.transactionDate': { $gte: operationalDayStartString, $lte: operationalDayEndString },
					'transaction.validationStatus': { $in: [0, 8] },
				};

				const bufferValidationTransactionsQuery = {
					operational_day: operationalDay,
					type: 'validation_transaction',
				};

				const pcgiValidationTransactionsDocumentTransform = (pcgiDocument) => {
					return {
						agency_id: pcgiDocument.transaction.operatorLongID,
						data: JSON.stringify(pcgiDocument),
						line_id: pcgiDocument.transaction.lineLongId,
						operational_day: operationalDay,
						original_id: String(pcgiDocument._id),
						pattern_id: pcgiDocument.transaction.patternLongId,
						route_id: pcgiDocument.transaction.routeLongId,
						stop_id: pcgiDocument.transaction.stopLongID,
						timestamp: DateTime.fromFormat(pcgiDocument.transaction.transactionDate, 'yyyy-LL-dd\'T\'HH:mm:ss').toMillis(),
						trip_id: pcgiDocument.transaction.journeyID,
						type: 'validation_transaction',
					};
				};

				await syncDocuments('validation_transaction', operationalDay, PCGIDB.ValidationEntity, SLAMANAGERBUFFERDB.BufferData, pcgiValidationTransactionsQuery, bufferValidationTransactionsQuery, pcgiValidationTransactionsDocumentTransform, bufferDataDbWritter);

				//
			}
			catch (error) {
				LOGGER.error(`Error syncing Validation Transactions for "${operationalDay}".`, error);
			}

			await bufferDataDbWritter.flush();

			// 3.6.
			// Syncronize Location Transactions

			try {
				//

				const pcgiLocationTransactionsQuery = {
					'transaction.transactionDate': { $gte: operationalDayStartString, $lte: operationalDayEndString },
				};

				const bufferLocationTransactionsQuery = {
					operational_day: operationalDay,
					type: 'location_transaction',
				};

				const pcgiLocationTransactionsDocumentTransform = (pcgiDocument) => {
					return {
						agency_id: pcgiDocument.transaction.operatorLongID,
						data: JSON.stringify(pcgiDocument),
						line_id: pcgiDocument.transaction.lineLongId,
						operational_day: operationalDay,
						original_id: String(pcgiDocument._id),
						pattern_id: pcgiDocument.transaction.patternLongId,
						route_id: pcgiDocument.transaction.routeLongId,
						stop_id: pcgiDocument.transaction.stopLongID,
						timestamp: DateTime.fromFormat(pcgiDocument.transaction.transactionDate, 'yyyy-LL-dd\'T\'HH:mm:ss').toMillis(),
						trip_id: pcgiDocument.transaction.journeyID,
						type: 'location_transaction',
					};
				};

				await syncDocuments('location_transaction', operationalDay, PCGIDB.LocationEntity, SLAMANAGERBUFFERDB.BufferData, pcgiLocationTransactionsQuery, bufferLocationTransactionsQuery, pcgiLocationTransactionsDocumentTransform, bufferDataDbWritter);

				//
			}
			catch (error) {
				LOGGER.error(`Error syncing Location Transactions for "${operationalDay}".`, error);
			}

			await bufferDataDbWritter.flush();

			//

			LOGGER.success(`[${operationalDayIndex + 1}/${allOperationalDays.length}] Buffering complete for operational_day "${operationalDay}" (${operationalDayTimer.get()})`);

			//
		}

		//

		console.log();
		console.log('- - - - - - - - - - - - - - - - - - - - -');
		console.log(`Run took ${globalTimer.get()}.`);
		console.log('- - - - - - - - - - - - - - - - - - - - -');
		console.log();

		//
	}
	catch (err) {
		console.log('An error occurred. Halting execution.', err);
		console.log('Retrying in 10 seconds...');
		setTimeout(() => {
			process.exit(0); // End process
		}, 10000); // after 10 seconds
	}

	//
};
