/* * */

import DBWRITER from '@/services/DBWRITER.js';
import PCGIDB from '@/services/PCGIDB.js';
import SLAMANAGERDB from '@/services/SLAMANAGERDB.js';
import SLAMANAGERQUEUEDB from '@/services/SLAMANAGERQUEUEDB.js';
import TIMETRACKER from '@/services/TIMETRACKER.js';
import { DateTime } from 'luxon';

/* * */

export default async () => {
	//

	try {
		console.log();
		console.log('------------------------');
		console.log((new Date()).toISOString());
		console.log('------------------------');
		console.log();

		const globalTimer = new TIMETRACKER();
		console.log('Starting...');

		// 1.
		// Connect to databases

		console.log();
		console.log('→ Connect to databases');

		await SLAMANAGERDB.connect();
		await SLAMANAGERQUEUEDB.connect();
		await PCGIDB.connect();

		const queueDataDbWritter = new DBWRITER('QueueData', SLAMANAGERQUEUEDB.QueueData, { batch_size: 10000 });

		// 2.
		// Get all operational days pending analysis

		const allOperationalDays = await SLAMANAGERDB.TripAnalysis.distinct('operational_day', { status: 'pending' }).sort({ operational_day: 1	});

		console.log(`→ Found ${allOperationalDays.length} operational days pending analysis.`);

		// 3.
		// Iterate on each day

		for (const [operationalDayIndex, operationalDay] of allOperationalDays.entries()) {
			//

			console.log();
			console.log('----------------------------------------------------------');
			console.log();

			// Convert operational day into required formats

			const operationalDayStart = DateTime.fromFormat(operationalDay, 'yyyyMMdd').set({ hour: 4, minute: 0, second: 0 });
			const operationalDayEnd = DateTime.fromFormat(operationalDay, 'yyyyMMdd').plus({ day: 1 }).set({ hour: 3, minute: 59, second: 59 });

			const operationalDayStartMillis = operationalDayStart.toMillis();
			const operationalDayEndMillis = operationalDayEnd.toMillis();

			const operationalDayStartString = operationalDayStart.toFormat('yyyy-LL-dd\'T\'HH\':\'mm\':\'ss');
			const operationalDayEndString = operationalDayEnd.toFormat('yyyy-LL-dd\'T\'HH\':\'mm\':\'ss');

			// Request PCGi data for the current operational_day

			const pcgiDbTimer = new TIMETRACKER();

			//
			// For Vehicle Events

			console.log();
			console.log(`→ Fetching PCGI Vehicle Events for "${operationalDay}"...`);

			const pcgiVehicleEventsStream = PCGIDB.VehicleEvents
				.find({ 'content.entity.vehicle.trip.tripId': { $exists: true }, 'millis': { $gte: operationalDayStartMillis, $lte: operationalDayEndMillis } })
				.stream();

			let pcgiVehicleEventsCounter = 0;

			for await (const vehicleEventData of pcgiVehicleEventsStream) {
				//

				pcgiVehicleEventsCounter++;

				const parsedTimestamp = DateTime.fromSeconds(vehicleEventData.content.entity[0].vehicle.timestamp).toMillis();

				const formattedObject = {
					agency_id: vehicleEventData.content.entity[0].vehicle.agencyId,
					data: JSON.stringify(vehicleEventData),
					line_id: vehicleEventData.content.entity[0].vehicle.trip.lineId,
					operational_day: operationalDay,
					original_id: String(vehicleEventData._id),
					pattern_id: vehicleEventData.content.entity[0].vehicle.trip.patternId,
					route_id: vehicleEventData.content.entity[0].vehicle.trip.routeId,
					stop_id: vehicleEventData.content.entity[0].vehicle.trip.stopId,
					timestamp: parsedTimestamp,
					trip_id: vehicleEventData.content.entity[0].vehicle.trip.tripId,
					type: 'vehicle_event',
				};

				await queueDataDbWritter.write(formattedObject, { filter: { original_id: formattedObject.original_id }, upsert: true });

				//
			}

			//
			// For Validation Transactions

			console.log();
			console.log(`→ Fetching PCGI Validation Transactions for "${operationalDay}"...`);

			const pcgiValidationTransactionsStream = PCGIDB.ValidationEntity
				.find({ 'transaction.transactionDate': { $gte: operationalDayStartString, $lte: operationalDayEndString }, 'transaction.validationStatus': { $in: [0, 8] } })
				.stream();

			let pcgiValidationTransactionsCounter = 0;

			for await (const validationTransactionData of pcgiValidationTransactionsStream) {
				//

				pcgiValidationTransactionsCounter++;

				const parsedTimestamp = DateTime.fromFormat(validationTransactionData.transaction.transactionDate, 'yyyy-LL-dd\'T\'HH:mm:ss').toMillis();

				const formattedObject = {
					agency_id: validationTransactionData.transaction.operatorLongID,
					data: JSON.stringify(validationTransactionData),
					line_id: validationTransactionData.transaction.lineLongId,
					operational_day: operationalDay,
					original_id: String(validationTransactionData._id),
					pattern_id: validationTransactionData.transaction.patternLongId,
					route_id: validationTransactionData.transaction.routeLongId,
					stop_id: validationTransactionData.transaction.stopLongID,
					timestamp: parsedTimestamp,
					trip_id: validationTransactionData.transaction.journeyID,
					type: 'validation_transaction',
				};

				await queueDataDbWritter.write(formattedObject, { filter: { original_id: formattedObject.original_id }, upsert: true });

				//
			}

			//
			// For Location Transactions

			console.log();
			console.log(`→ Fetching PCGI Location Transactions for "${operationalDay}"...`);

			const pcgiLocationTransactionsStream = PCGIDB.LocationEntity
				.find({ 'transaction.transactionDate': { $gte: operationalDayStartString, $lte: operationalDayEndString } })
				.stream();

			let pcgiLocationTransactionsCounter = 0;

			for await (const locationTransactionData of pcgiLocationTransactionsStream) {
				//

				pcgiLocationTransactionsCounter++;

				const parsedTimestamp = DateTime.fromFormat(locationTransactionData.transaction.transactionDate, 'yyyy-LL-dd\'T\'HH:mm:ss').toMillis();

				const formattedObject = {
					agency_id: locationTransactionData.transaction.operatorLongID,
					data: JSON.stringify(locationTransactionData),
					line_id: locationTransactionData.transaction.lineLongId,
					operational_day: operationalDay,
					original_id: String(locationTransactionData._id),
					pattern_id: locationTransactionData.transaction.patternLongId,
					route_id: locationTransactionData.transaction.routeLongId,
					stop_id: locationTransactionData.transaction.stopLongID,
					timestamp: parsedTimestamp,
					trip_id: locationTransactionData.transaction.journeyID,
					type: 'location_transaction',
				};

				await queueDataDbWritter.write(formattedObject, { filter: { original_id: formattedObject.original_id }, upsert: true });

				//
			}

			//

			await queueDataDbWritter.flush();

			//

			await SLAMANAGERDB.TripAnalysis.updateMany({ operational_day: operationalDay, status: 'pending' }, { $set: { status: 'queued' } });

			//

			console.log();
			console.log(`✓ [${operationalDayIndex + 1}/${allOperationalDays.length}] PCGI Request for operational_day "${operationalDay}" (${pcgiDbTimer.get()}) | VehicleEvents: ${pcgiVehicleEventsCounter} | ValidationTransactions: ${pcgiValidationTransactionsCounter} | LocationTransactions: ${pcgiLocationTransactionsCounter}`);
			console.log();

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
