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
		console.log('STEP 0.1: Connect to databases');

		await PCGIDB.connect();
		await SLAMANAGERDB.connect();

		// 2.
		// Await for a random amount of time to reduce chances of requesting the same trips as another worker

		// const randomDelay = Math.floor(Math.random() * 5000); // 0 - 5 seconds
		// await new Promise((resolve) => setTimeout(resolve, randomDelay));

		// 3.
		// Fetch a fresh batch of trips

		const allTripIds = await SLAMANAGERDB.TripAnalysis.distinct('trip_id', { status: 'waiting' });

		for (const [
			tripIdIndex, tripId,
		] of allTripIds.entries()) {
			console.log();
			console.log('----------------------------------------------------------');

			const allTripEventsOrganizedByDay = new Map;

			const pcgiDbTimer = new TIMETRACKER;

			const pcgiEvents = PCGIDB.VehicleEvents.find({ 'content.entity.vehicle.trip.tripId': { $eq: tripId } }).stream();

			let eventsCounter = 0;
			for await (const event of pcgiEvents) {
				eventsCounter++;
				const day = DateTime.fromSeconds(event.content.entity[0].vehicle.timestamp).startOf('day').toFormat('yyyyMMdd');
				if (!allTripEventsOrganizedByDay.has(day)) {
					allTripEventsOrganizedByDay.set(day, [
					]);
				}
				allTripEventsOrganizedByDay.get(day).push(event);
			}

			console.log(`FETCH EVENTS | trip_id: ${tripId} | eventsCounter: ${eventsCounter} | pcgiDbTimer: ${pcgiDbTimer.get()}`);

			const allTripsData = await SLAMANAGERDB.TripAnalysis.find({ status: 'waiting', trip_id: tripId }).sort({ operational_day: 1, trip_id: 1 }).toArray();

			for (const [tripIndex, tripData] of allTripsData.entries()) {
				//

				const tripTimer = new TIMETRACKER;

				const uniqueTripData = await SLAMANAGERDB.UniqueTrip.findOne({ code: tripData.unique_trip_code });
				const tripEvents = allTripEventsOrganizedByDay.get(tripData.operational_day);

				// RUN ANALYZERS

				const simpleThreeEventsAnalyzerResult = await simpleThreeEventsAnalyzer({ unique_trip: uniqueTripData, events: tripEvents });

				tripData.analysis = [
					simpleThreeEventsAnalyzerResult,
				];
				tripData.status = 'complete';

				await SLAMANAGERDB.TripAnalysis.findOneAndReplace({ code: tripData.code }, tripData);

				console.log(`[${tripIdIndex + 1}/${allTripIds.length}] [${tripIndex + 1}/${allTripsData.length}] DONE | ${tripData.code} | grade: ${simpleThreeEventsAnalyzerResult.grade} | tripTimer: ${tripTimer.get()}`);

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