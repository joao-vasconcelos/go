/* * */

import PCGIDB from './services/PCGIDB';
import SLAMANAGERDB from './services/SLAMANAGERDB';
import TIMETRACKER from './services/TIMETRACKER';
import { DateTime } from 'luxon';

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

		const randomDelay = Math.floor(Math.random() * 5000); // 0 - 5 seconds
		await new Promise((resolve) => setTimeout(resolve, randomDelay));

		// 3.
		// Fetch a fresh batch of trips

		const allTripsData = await SLAMANAGERDB.TripAnalysis.find({ status: 'waiting', operational_day: { $gte: '20240429' } }).sort({ operational_day: 1, trip_id: 1 }).limit(1000).toArray();

		for (const [
			tripIndex, tripData,
		] of allTripsData.entries()) {
			//

			const tripTimer = new TIMETRACKER;

			const uniqueTripData = await SLAMANAGERDB.UniqueTrip.findOne({ code: tripData.unique_trip_code });

			// const uniqueShapeData = await SLAMANAGERDB.UniqueShape.findOne({ code: tripData.unique_shape_code })

			const pcgiQuery = {
				'content.entity.vehicle.trip.tripId': { $eq: tripData.trip_id },
				'content.entity.vehicle.timestamp': {
					$gte: DateTime.fromFormat(tripData.operational_day, 'yyyyMMdd').set({ hour: 4, minute: 0, second: 0 }).toUnixInteger(),
					$lte: DateTime.fromFormat(tripData.operational_day, 'yyyyMMdd').plus({ day: 1 }).set({ hour: 3, minute: 59, second: 59 }).toUnixInteger(),
				},
			};

			const tripEvents = await PCGIDB.VehicleEvents.find(pcgiQuery).hint({ 'content.entity.vehicle.trip.tripId': 1 }).toArray();

			// RUN ANALYZERS

			const simpleThreeEventsAnalyzerResult = await simpleThreeEventsAnalyzer({ unique_trip: uniqueTripData, events: tripEvents });

			tripData.analysis = [
				simpleThreeEventsAnalyzerResult,
			];
			tripData.status = 'complete';

			await SLAMANAGERDB.TripAnalysis.findOneAndReplace({ code: tripData.code }, tripData);

			console.log('-------');
			console.log(pcgiQuery);
			console.log(`[${tripIndex + 1}/${allTripsData.length}] DONE | ${tripData.code} | grade: ${simpleThreeEventsAnalyzerResult.grade} | tripTimer: ${tripTimer.get()}`);

			//
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