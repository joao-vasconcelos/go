/* * */

import PCGIDB from './services/PCGIDB';
import SLAMANAGERDB from './services/SLAMANAGERDB';
import TIMETRACKER from './services/TIMETRACKER';
import { DateTime } from 'luxon';

/* * */

import simpleThreeEventsAnalyzer from './analyzers/simpleThreeEvents.analyzer';

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
		console.log('-> Connect to databases');

		await PCGIDB.connect();
		await SLAMANAGERDB.connect();

		//
		// RESET ALL ANALYSIS STATUS
		// await SLAMANAGERDB.TripAnalysis.updateMany({ }, { $set: { status: 'waiting' } });

		// 2.
		// Fetch a fresh batch of trips

		const allOperationalDays = await SLAMANAGERDB.TripAnalysis.distinct('operational_day', { status: 'waiting' });

		for (const [operationalDayIndex, operationalDay] of allOperationalDays.entries()) {
			//

			if (operationalDay !== '20240401') continue;

			console.log();
			console.log('----------------------------------------------------------');

			const allEventIdsOrganizedByTripId = new Map;

			const pcgiDbTimer = new TIMETRACKER;

			const operationalDayStart = DateTime.fromFormat(operationalDay, 'yyyyMMdd').set({ hour: 4, minute: 0, second: 0 }).toMillis();
			const operationalDayEnd = DateTime.fromFormat(operationalDay, 'yyyyMMdd').plus({ day: 1 }).set({ hour: 3, minute: 59, second: 59 }).toMillis();

			const foundEventIdsbyTripId = PCGIDB.VehicleEvents
				.aggregate([
					{ $match: { millis: { $gte: operationalDayStart, $lte: operationalDayEnd } } },
					{ $project: { _id: 1, tripId: '$content.entity.vehicle.trip.tripId' } },
					{ $group: { _id: '$tripId', document_ids: { $addToSet: '$_id' } } },
				])
				.stream();

			let foundEventIdsCounter = 0;
			for await (const eventIdsForTripId of foundEventIdsbyTripId) {
				foundEventIdsCounter++;
				const currentTripId = eventIdsForTripId._id[0];
				if (!allEventIdsOrganizedByTripId.has(currentTripId)) {
					allEventIdsOrganizedByTripId.set(currentTripId, eventIdsForTripId.document_ids);
				}
				allEventIdsOrganizedByTripId.set(currentTripId, [...allEventIdsOrganizedByTripId.get(currentTripId), ...eventIdsForTripId.document_ids].flat());
			}

			console.log(`FETCH EVENTS | operational_day: ${operationalDay} | foundEventIdsCounter: ${foundEventIdsCounter} | pcgiDbTimer: ${pcgiDbTimer.get()}`);

			//
			//
			//
			//

			const allTripsData = await SLAMANAGERDB.TripAnalysis.find({ status: 'waiting', operational_day: operationalDay }).sort({ trip_id: 1 }).toArray();

			for (const [tripIndex, tripData] of allTripsData.entries()) {
				//

				const uniqueTripData = await SLAMANAGERDB.UniqueTrip.findOne({ code: tripData.unique_trip_code });

				const tripEventIds = allEventIdsOrganizedByTripId.get(tripData.trip_id);

				let tripEvents = [];

				if (tripEventIds) {
					tripEvents = await PCGIDB.VehicleEvents.find({ _id: { $in: tripEventIds } }).toArray();
				}

				// RUN ANALYZERS

				const simpleThreeEventsAnalyzerResult = await simpleThreeEventsAnalyzer({ unique_trip: uniqueTripData, events: tripEvents });

				tripData.analysis = [simpleThreeEventsAnalyzerResult];
				tripData.status = 'complete';

				await SLAMANAGERDB.TripAnalysis.findOneAndReplace({ code: tripData.code }, tripData);

				console.log(`[${operationalDayIndex + 1}/${allOperationalDays.length}] [${tripIndex + 1}/${allTripsData.length}] DONE | ${tripData.code} | grade: ${simpleThreeEventsAnalyzerResult.grade} | reason: ${simpleThreeEventsAnalyzerResult.reason}`);

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