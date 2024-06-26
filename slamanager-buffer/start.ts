/* * */

import DBWRITER from '@/services/DBWRITER.js';
import PCGIDB from '@/services/PCGIDB.js';
import SLAMANAGERBUFFERDB from '@/services/SLAMANAGERBUFFERDB.js';
import SLAMANAGERDB from '@/services/SLAMANAGERDB.js';
import LOGGER from '@helperkits/logger';
import TIMETRACKER from '@helperkits/timer';
import { DateTime } from 'luxon';

/* * */

const BUFFER_START_DATE = '20240613';
const BUFFER_END_DATE = '20240613';

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

		const bufferDataDbWritter = new DBWRITER('BufferData', SLAMANAGERBUFFERDB.BufferData, { batch_size: 10000 });

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

			const operationalDayStatus = await SLAMANAGERBUFFERDB.BufferStatus.find({ operational_day: operationalDay }).toArray();

			if (operationalDay < BUFFER_START_DATE || operationalDay > BUFFER_END_DATE || (operationalDayStatus.length > 0 && operationalDayStatus[0]?.status === 'complete')) {
				LOGGER.success(`[${operationalDayIndex + 1}/${allOperationalDays.length}] Skipping operational_day "${operationalDay}" as it is outside the allowed buffer range (${BUFFER_START_DATE} - ${BUFFER_END_DATE}).`);
				continue;
			}

			// 3.2.
			// Convert operational day into required formats

			const operationalDayStart = DateTime.fromFormat(operationalDay, 'yyyyMMdd').set({ hour: 4, minute: 0, second: 0 });
			const operationalDayEnd = DateTime.fromFormat(operationalDay, 'yyyyMMdd').plus({ day: 1 }).set({ hour: 3, minute: 59, second: 59 });

			const operationalDayStartMillis = operationalDayStart.toMillis();
			const operationalDayEndMillis = operationalDayEnd.toMillis();

			const operationalDayStartString = operationalDayStart.toFormat('yyyy-LL-dd\'T\'HH\':\'mm\':\'ss');
			const operationalDayEndString = operationalDayEnd.toFormat('yyyy-LL-dd\'T\'HH\':\'mm\':\'ss');

			// 3.1.
			// Syncronize BufferData by looking for _ids present in PCGIDB but not in SLAMANAGERBUFFERDB

			//
			// For Vehicle Events

			try {
				//

				LOGGER.info(`Syncing Vehicle Events for "${operationalDay}"...`);

				const vehicleEventsTimer = new TIMETRACKER();

				// Fetch all existing Vehicle Event IDs from SLAMANAGERBUFFERDB

				const bufferVehicleEventsIdsSet = new Set();

				const bufferVehicleEventsStream = await SLAMANAGERBUFFERDB.BufferData
					.find({ operational_day: operationalDay, type: 'vehicle_event' })
					.stream();

				for await (const bufferVehicleEventDocument of bufferVehicleEventsStream) {
					bufferVehicleEventsIdsSet.add(String(bufferVehicleEventDocument.original_id));
				}

				LOGGER.info(`Fetched ${bufferVehicleEventsIdsSet.size} Vehicle Event IDs from SLAMANAGERBUFFERDB for "${operationalDay}" (${vehicleEventsTimer.get()})`);

				// Fetch Vehicle Events from PCGIDB

				LOGGER.info(`Fetching PCGIDB Vehicle Events for "${operationalDay}"...`);

				const pcgiVehicleEventsStream = PCGIDB.VehicleEvents
					.find({ 'content.entity.vehicle.trip.tripId': { $exists: true }, 'millis': { $gte: operationalDayStartMillis, $lte: operationalDayEndMillis } })
					.stream();

				let pcgiVehicleEventsCounter = 0;

				for await (const vehicleEventData of pcgiVehicleEventsStream) {
					//

					// Skip if already present in SLAMANAGERBUFFERDB

					if (bufferVehicleEventsIdsSet.has(String(vehicleEventData._id))) {
						continue;
					}

					// If not yet present, add it to SLAMANAGERBUFFERDB

					pcgiVehicleEventsCounter++;

					const formattedObject = {
						agency_id: vehicleEventData.content.entity[0].vehicle.agencyId,
						data: JSON.stringify(vehicleEventData),
						line_id: vehicleEventData.content.entity[0].vehicle.trip.lineId,
						operational_day: operationalDay,
						original_id: String(vehicleEventData._id),
						pattern_id: vehicleEventData.content.entity[0].vehicle.trip.patternId,
						route_id: vehicleEventData.content.entity[0].vehicle.trip.routeId,
						stop_id: vehicleEventData.content.entity[0].vehicle.trip.stopId,
						timestamp: DateTime.fromSeconds(vehicleEventData.content.entity[0].vehicle.timestamp).toMillis(),
						trip_id: vehicleEventData.content.entity[0].vehicle.trip.tripId,
						type: 'vehicle_event',
					};

					await bufferDataDbWritter.write(formattedObject, { filter: { original_id: formattedObject.original_id }, upsert: true });

				//
				}

				LOGGER.success(`Synced all Vehicle Events from PCGIDB to SLAMANAGERBUFFERDB for operational_day "${operationalDay}" (${vehicleEventsTimer.get()}) | Added Vehicle Events: ${pcgiVehicleEventsCounter}`);

				//
			}
			catch (error) {
				LOGGER.error(`Error syncing Vehicle Events for "${operationalDay}".`, error);
			}

			await bufferDataDbWritter.flush();

			//
			// For Validation Transactions

			try {
				//

				LOGGER.info(`Syncing Validation Transactions for "${operationalDay}"...`);

				const validationTransactionsTimer = new TIMETRACKER();

				// Fetch all existing Validation Transactions IDs from SLAMANAGERBUFFERDB

				const bufferValidationTransactionsIdsSet = new Set();

				const bufferValidationTransactionsStream = await SLAMANAGERBUFFERDB.BufferData
					.find({ operational_day: operationalDay, type: 'validation_transaction' })
					.stream();

				for await (const bufferValidationTransactionDocument of bufferValidationTransactionsStream) {
					bufferValidationTransactionsIdsSet.add(String(bufferValidationTransactionDocument.original_id));
				}

				LOGGER.info(`Fetched ${bufferValidationTransactionsIdsSet.size} Validation Transaction IDs from SLAMANAGERBUFFERDB for "${operationalDay}" (${validationTransactionsTimer.get()})`);

				// Fetch Validation Transactions from PCGI

				LOGGER.info(`Fetching PCGI Validation Transactions for "${operationalDay}"...`);

				const pcgiValidationTransactionsStream = PCGIDB.ValidationEntity
					.find({ 'transaction.transactionDate': { $gte: operationalDayStartString, $lte: operationalDayEndString }, 'transaction.validationStatus': { $in: [0, 8] } })
					.stream();

				let pcgiValidationTransactionsCounter = 0;

				for await (const validationTransactionData of pcgiValidationTransactionsStream) {
					//

					// Skip if already present in SLAMANAGERBUFFERDB

					if (bufferValidationTransactionsIdsSet.has(String(validationTransactionData._id))) {
						continue;
					}

					// If not yet present, add it to SLAMANAGERBUFFERDB

					pcgiValidationTransactionsCounter++;

					const formattedObject = {
						agency_id: validationTransactionData.transaction.operatorLongID,
						data: JSON.stringify(validationTransactionData),
						line_id: validationTransactionData.transaction.lineLongId,
						operational_day: operationalDay,
						original_id: String(validationTransactionData._id),
						pattern_id: validationTransactionData.transaction.patternLongId,
						route_id: validationTransactionData.transaction.routeLongId,
						stop_id: validationTransactionData.transaction.stopLongID,
						timestamp: DateTime.fromFormat(validationTransactionData.transaction.transactionDate, 'yyyy-LL-dd\'T\'HH:mm:ss').toMillis(),
						trip_id: validationTransactionData.transaction.journeyID,
						type: 'validation_transaction',
					};

					await bufferDataDbWritter.write(formattedObject, { filter: { original_id: formattedObject.original_id }, upsert: true });

				//
				}

				LOGGER.success(`Synced all Validation Transactions from PCGI to SLAMANAGERBUFFERDB for operational_day "${operationalDay}" (${validationTransactionsTimer.get()}) | Added Validation Transactions: ${pcgiValidationTransactionsCounter}`);

				//
			}
			catch (error) {
				LOGGER.error(`Error syncing Validation Transactions for "${operationalDay}".`, error);
			}

			await bufferDataDbWritter.flush();

			//
			// For Location Transactions

			try {
				//

				LOGGER.info(`Syncing Location Transactions for "${operationalDay}"...`);

				const locationTransactionsTimer = new TIMETRACKER();

				// Fetch all existing Location Transaction IDs from SLAMANAGERBUFFERDB

				const bufferLocationTransactionsIdsSet = new Set();

				const bufferLocationTransactionsStream = await SLAMANAGERBUFFERDB.BufferData
					.find({ operational_day: operationalDay, type: 'location_transaction' })
					.stream();

				for await (const bufferLocationTransactionDocument of bufferLocationTransactionsStream) {
					bufferLocationTransactionsIdsSet.add(String(bufferLocationTransactionDocument.original_id));
				}

				LOGGER.info(`Fetched ${bufferLocationTransactionsIdsSet.size} Location Transaction IDs from SLAMANAGERBUFFERDB for "${operationalDay}" (${locationTransactionsTimer.get()})`);

				// Fetch Location Transactions from PCGI

				LOGGER.info(`Fetching PCGI Location Transactions for "${operationalDay}"...`);

				const pcgiLocationTransactionsStream = PCGIDB.LocationEntity
					.find({ 'transaction.transactionDate': { $gte: operationalDayStartString, $lte: operationalDayEndString } })
					.stream();

				let pcgiLocationTransactionsCounter = 0;

				for await (const locationTransactionData of pcgiLocationTransactionsStream) {
					//

					// Skip if already present in SLAMANAGERBUFFERDB

					if (bufferLocationTransactionsIdsSet.has(String(locationTransactionData._id))) {
						continue;
					}

					// If not yet present, add it to SLAMANAGERBUFFERDB

					pcgiLocationTransactionsCounter++;

					const formattedObject = {
						agency_id: locationTransactionData.transaction.operatorLongID,
						data: JSON.stringify(locationTransactionData),
						line_id: locationTransactionData.transaction.lineLongId,
						operational_day: operationalDay,
						original_id: String(locationTransactionData._id),
						pattern_id: locationTransactionData.transaction.patternLongId,
						route_id: locationTransactionData.transaction.routeLongId,
						stop_id: locationTransactionData.transaction.stopLongID,
						timestamp: DateTime.fromFormat(locationTransactionData.transaction.transactionDate, 'yyyy-LL-dd\'T\'HH:mm:ss').toMillis(),
						trip_id: locationTransactionData.transaction.journeyID,
						type: 'location_transaction',
					};

					await bufferDataDbWritter.write(formattedObject, { filter: { original_id: formattedObject.original_id }, upsert: true });

				//
				}

				LOGGER.success(`Synced all Location Transactions from PCGI to SLAMANAGERBUFFERDB for operational_day "${operationalDay}" (${locationTransactionsTimer.get()}) | Added Location Transactions: ${pcgiLocationTransactionsCounter}`);

				//
			}
			catch (error) {
				LOGGER.error(`Error syncing Location Transactions for "${operationalDay}".`, error);
			}

			//

			await bufferDataDbWritter.flush();

			//

			await SLAMANAGERBUFFERDB.BufferStatus.updateOne({ operational_day: operationalDay }, { $set: { status: 'complete' } });

			LOGGER.success(`[${operationalDayIndex + 1}/${allOperationalDays.length}] PCGI Request for operational_day "${operationalDay}" (${operationalDayTimer.get()})`);

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
