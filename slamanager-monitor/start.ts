/* * */

import PCGIDB from './services/PCGIDB';
import SLAMANAGERDB from './services/SLAMANAGERDB';
import TIMETRACKER from './services/TIMETRACKER';
import { DateTime } from 'luxon';

/* * */

import simpleThreeEventsAnalyzer from './analyzers/simpleThreeEvents.analyzer';
import { AnalysisData } from 'analyzers/analysisData.types';
import simpleOneEventAnalyzer from 'analyzers/simpleOneEvent.analyzer';
import lessThanTenEventsAnalyzer from 'analyzers/lessThanTenEvents.analyzer';
import atMostTwoDriversAnalyzer from 'analyzers/atMostTwoDrivers.analyzer';

/* * */

export default async () => {
	//

	try {
		console.log();
		console.log('------------------------');
		console.log((new Date).toISOString());
		console.log('------------------------');
		console.log();

		const globalTimer = new TIMETRACKER;
		console.log('Starting...');

		// 1.
		// Connect to databases

		console.log();
		console.log('→ Connect to databases');

		await SLAMANAGERDB.connect();
		await PCGIDB.connect();

		// 2.
		// Get all operational days pending analysis

		const allOperationalDays = await SLAMANAGERDB.TripAnalysis.distinct('operational_day', { status: 'waiting', operational_day: { $gte: '20240401', $lte: '20240430' } });

		console.log(`→ Found ${allOperationalDays.length} operational days pending analysis.`);

		// 3.
		// Iterate on each day

		for (const [operationalDayIndex, operationalDay] of allOperationalDays.entries()) {
			//

			console.log();
			console.log('----------------------------------------------------------');
			console.log();

			// 3.1.
			// Setup hashmap variables to hold PCGi data organized by trip_id

			const allPcgiVehicleEventsIdsOrganizedByTripId = new Map;
			const allPcgiValidationTransactionsIdsOrganizedByTripId = new Map;
			const allPcgiLocationTransactionsIdsOrganizedByTripId = new Map;

			// 3.2.
			// Convert operational day into required formats

			const operationalDayStart = DateTime.fromFormat(operationalDay, 'yyyyMMdd').set({ hour: 4, minute: 0, second: 0 });
			const operationalDayEnd = DateTime.fromFormat(operationalDay, 'yyyyMMdd').plus({ day: 1 }).set({ hour: 3, minute: 59, second: 59 });

			const operationalDayStartMillis = operationalDayStart.toMillis();
			const operationalDayEndMillis = operationalDayEnd.toMillis();

			const operationalDayStartString = operationalDayStart.toFormat("yyyy-LL-dd'T'HH':'mm':'ss");
			const operationalDayEndString = operationalDayEnd.toFormat("yyyy-LL-dd'T'HH':'mm':'ss");

			// 3.3.
			// Request PCGi data for the day and organize by trip_id

			const pcgiDbTimer = new TIMETRACKER;

			// For Vehicle Events

			console.log('→ Fetching PCGI Vehicle Events...');

			const pcgiVehicleEventsIdsAggregationStream = PCGIDB.VehicleEvents
				.aggregate([
					{ $match: { millis: { $gte: operationalDayStartMillis, $lte: operationalDayEndMillis } } },
					{ $project: { _id: 1, tripId: '$content.entity.vehicle.trip.tripId' } },
					{ $group: { _id: { $first: '$tripId' }, document_ids: { $addToSet: '$_id' } } },
				])
				.stream();

			let pcgiVehicleEventsCounter = 0;
			for await (const vehicleEventsIdsForTripId of pcgiVehicleEventsIdsAggregationStream) {
				const currentTripId = vehicleEventsIdsForTripId._id;
				if (!allPcgiVehicleEventsIdsOrganizedByTripId.has(currentTripId)) {
					allPcgiVehicleEventsIdsOrganizedByTripId.set(currentTripId, vehicleEventsIdsForTripId.document_ids);
				}
				const mergedVehicleEventsIds = [...allPcgiVehicleEventsIdsOrganizedByTripId.get(currentTripId), ...vehicleEventsIdsForTripId.document_ids];
				allPcgiVehicleEventsIdsOrganizedByTripId.set(currentTripId, mergedVehicleEventsIds.flat());
				pcgiVehicleEventsCounter += mergedVehicleEventsIds.length;
			}

			// For Validation Transactions

			console.log('→ Fetching PCGI Validation Transactions...');

			const pcgiValidationTransactionsIdsAggregationStream = PCGIDB.ValidationEntity
				.aggregate([
					{ $match: { 'transaction.transactionDate': { $gte: operationalDayStartString, $lte: operationalDayEndString }, 'transaction.validationStatus': { $in: [0, 8] } } },
					{ $project: { _id: 1, tripId: '$transaction.journeyID' } },
					{ $group: { _id: '$tripId', document_ids: { $addToSet: '$_id' } } },
				])
				.stream();

			let pcgiValidationTransactionsCounter = 0;
			for await (const validationTransactionsIdsForTripId of pcgiValidationTransactionsIdsAggregationStream) {
				const currentTripId = validationTransactionsIdsForTripId._id;
				if (!allPcgiValidationTransactionsIdsOrganizedByTripId.has(currentTripId)) {
					allPcgiValidationTransactionsIdsOrganizedByTripId.set(currentTripId, validationTransactionsIdsForTripId.document_ids);
				}
				const mergedValidationTransactionsIds = [...allPcgiValidationTransactionsIdsOrganizedByTripId.get(currentTripId), ...validationTransactionsIdsForTripId.document_ids];
				allPcgiValidationTransactionsIdsOrganizedByTripId.set(currentTripId, mergedValidationTransactionsIds.flat());
				pcgiValidationTransactionsCounter += mergedValidationTransactionsIds.length;
			}

			// For Location Transactions

			console.log('→ Fetching PCGI Location Transactions...');

			const pcgiLocationTransactionsIdsAggregationStream = PCGIDB.LocationEntity
				.aggregate([
					{ $match: { 'transaction.transactionDate': { $gte: operationalDayStartString, $lte: operationalDayEndString } } },
					{ $project: { _id: 1, tripId: '$transaction.journeyID' } },
					{ $group: { _id: '$tripId', document_ids: { $addToSet: '$_id' } } },
				])
				.stream();

			let pcgiLocationTransactionsCounter = 0;
			for await (const vehicleEventsIdsForTripId of pcgiLocationTransactionsIdsAggregationStream) {
				const currentTripId = vehicleEventsIdsForTripId._id;
				if (!allPcgiLocationTransactionsIdsOrganizedByTripId.has(currentTripId)) {
					allPcgiLocationTransactionsIdsOrganizedByTripId.set(currentTripId, vehicleEventsIdsForTripId.document_ids);
				}
				const mergedLocationTransactionsIds = [...allPcgiLocationTransactionsIdsOrganizedByTripId.get(currentTripId), ...vehicleEventsIdsForTripId.document_ids];
				allPcgiLocationTransactionsIdsOrganizedByTripId.set(currentTripId, mergedLocationTransactionsIds.flat());
				pcgiLocationTransactionsCounter += mergedLocationTransactionsIds.length;
			}

			//

			console.log(`→ PCGI Request for operational_day "${operationalDay}" (${pcgiDbTimer.get()}) | VehicleEvents: ${pcgiVehicleEventsCounter} | ValidationTransactions: ${pcgiValidationTransactionsCounter} | LocationTransactions: ${pcgiLocationTransactionsCounter}`);

			// 3.4.
			// Request SLAMANAGERDB for all pending trips for the current operational day

			const allTripsData = await SLAMANAGERDB.TripAnalysis.find({ status: 'waiting', operational_day: operationalDay }).sort({ trip_id: 1 }).toArray();

			// 3.5.
			// Iterate on each trip

			for (const [tripIndex, tripData] of allTripsData.entries()) {
				//

				// 3.5.1.
				// Get hashed path and shape for this trip

				const hashedTripData = await SLAMANAGERDB.UniqueTrip.findOne({ code: tripData.unique_trip_code });
				const hashedShapeData = await SLAMANAGERDB.UniqueShape.findOne({ code: tripData.unique_shape_code });

				// 3.5.2.
				// Get PCGI Vehicle Events for this trip (from an array of IDs)

				const allPcgiVehicleEventsIds = allPcgiVehicleEventsIdsOrganizedByTripId.get(tripData.trip_id);

				let allPcgiVehicleEventsData = [];
				if (allPcgiVehicleEventsIdsOrganizedByTripId.has(tripData.trip_id)) {
					allPcgiVehicleEventsData = await PCGIDB.VehicleEvents.find({ _id: { $in: allPcgiVehicleEventsIds || [] } }).toArray();
				}

				// 3.5.3.
				// Get PCGI Validation Transactions for this trip (from an array of IDs)

				const allPcgiValidationTransactionsIds = allPcgiValidationTransactionsIdsOrganizedByTripId.get(tripData.trip_id);

				let allPcgiValidationTransactionsData = [];
				if (allPcgiVehicleEventsIdsOrganizedByTripId.has(tripData.trip_id)) {
					allPcgiValidationTransactionsData = await PCGIDB.VehicleEvents.find({ _id: { $in: allPcgiValidationTransactionsIds || [] } }).toArray();
				}

				// 3.5.4.
				// Get PCGI Location Transactions for this trip (from an array of IDs)

				const allPcgiLocationTransactionsIds = allPcgiLocationTransactionsIdsOrganizedByTripId.get(tripData.trip_id);

				let allPcgiLocationTransactionsData = [];
				if (allPcgiVehicleEventsIdsOrganizedByTripId.has(tripData.trip_id)) {
					allPcgiLocationTransactionsData = await PCGIDB.VehicleEvents.find({ _id: { $in: allPcgiLocationTransactionsIds || [] } }).toArray();
				}

				// 3.5.5.
				// Build the analysis data, common to all analyzers

				const analysisData: AnalysisData = {
					hashed_trip: hashedTripData,
					hashed_shape: hashedShapeData,
					vehicle_events: allPcgiVehicleEventsData,
					validation_transactions: allPcgiValidationTransactionsData,
					location_transactions: allPcgiLocationTransactionsData,
				};

				// 3.5.6.
				// Run the analyzers

				tripData.analysis = [

					/* * * * */

					simpleOneEventAnalyzer(analysisData),

					simpleThreeEventsAnalyzer(analysisData),

					lessThanTenEventsAnalyzer(analysisData),

					atMostTwoDriversAnalyzer(analysisData),

					/* * * * */

				];

				// 3.5.7.
				// Update trip with analysis result and status

				tripData.status = 'complete';

				await SLAMANAGERDB.TripAnalysis.findOneAndReplace({ code: tripData.code }, tripData);

				//

				console.log(`[${operationalDayIndex + 1}/${allOperationalDays.length}] [${tripIndex + 1}/${allTripsData.length}] DONE | ${tripData.code}`);

				//
			}
		}

		//

		console.log();
		console.log('- - - - - - - - - - - - - - - - - - - - -');
		console.log(`Run took ${globalTimer.get()}.`);
		console.log('- - - - - - - - - - - - - - - - - - - - -');
		console.log();

		//
	} catch (err) {
		console.log('An error occurred. Halting execution.', err);
		console.log('Retrying in 10 seconds...');
		setTimeout(() => {
			process.exit(0); // End process
		}, 10000); // after 10 seconds
	}

	//
};