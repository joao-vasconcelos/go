/* * */

import { rides } from '@tmlmobilidade/core/interfaces';
import { getOperationalDate } from '@tmlmobilidade/core/utils';
import { DateTime } from 'luxon';

/* * */

export default async function handler(req, res) {
	try {
		//

		//
		// Define the returned object

		const response = {

			// For Area 1
			_41_scheduled_rides_operational_day: 0,
			_41_scheduled_rides_until_now: 0,
			_41_simple_three_events_or_validation_pass_until_now: 0,
			_41_simple_three_events_pass_until_now: 0,

			// For Area 2
			_42_scheduled_rides_operational_day: 0,
			_42_scheduled_rides_until_now: 0,
			_42_simple_three_events_or_validation_pass_until_now: 0,
			_42_simple_three_events_pass_until_now: 0,

			// For Area 3
			_43_scheduled_rides_operational_day: 0,
			_43_scheduled_rides_until_now: 0,
			_43_simple_three_events_or_validation_pass_until_now: 0,
			_43_simple_three_events_pass_until_now: 0,

			// For Area 4
			_44_scheduled_rides_operational_day: 0,
			_44_scheduled_rides_until_now: 0,
			_44_simple_three_events_or_validation_pass_until_now: 0,
			_44_simple_three_events_pass_until_now: 0,

			// For the whole CM
			_cm_scheduled_rides_operational_day: 0,
			_cm_scheduled_rides_until_now: 0,
			_cm_simple_three_events_or_validation_pass_until_now: 0,
			_cm_simple_three_events_pass_until_now: 0,

			//
		};

		//
		// Get all rides for today

		const ridesCollection = await rides.getCollection();
		const allRidesForTodayStream = ridesCollection.find({ operational_date: getOperationalDate() }).stream();

		//
		// Iterate on all rides for today

		for await (const rideData of allRidesForTodayStream) {
			//

			//
			// Update the count variables

			response._cm_scheduled_rides_operational_day++;

			if (rideData.agency_id === '41') response._41_scheduled_rides_operational_day++;
			if (rideData.agency_id === '42') response._42_scheduled_rides_operational_day++;
			if (rideData.agency_id === '43') response._43_scheduled_rides_operational_day++;
			if (rideData.agency_id === '44') response._44_scheduled_rides_operational_day++;

			//
			// Only consider rides that have already started (schedule start before now)
			// or have already been processed.

			const rideStartedBeforeNow = DateTime.fromJSDate(rideData.start_time_scheduled).toMillis() < DateTime.now().toMillis();

			const rideHasBeenProcessed = rideData.status === 'complete' && rideData.analysis.length > 0;

			if (!rideStartedBeforeNow || !rideHasBeenProcessed) continue;

			//
			// Update the count variables

			response._cm_scheduled_rides_until_now++;

			if (rideData.agency_id === '41') response._41_scheduled_rides_until_now++;
			if (rideData.agency_id === '42') response._42_scheduled_rides_until_now++;
			if (rideData.agency_id === '43') response._43_scheduled_rides_until_now++;
			if (rideData.agency_id === '44') response._44_scheduled_rides_until_now++;

			//
			// Check if the ride passed the SIMPLE_THREE_VEHICLE_EVENTS validation,
			// and if it passed the combination of SIMPLE_THREE_VEHICLE_EVENTS and SIMPLE_ONE_VALIDATION_TRANSACTION validations

			const simpleThreeVehicleEvents = rideData.analysis.find(item => item._id === 'SIMPLE_THREE_VEHICLE_EVENTS');
			const simpleOneValidationTransaction = rideData.analysis.find(item => item._id === 'SIMPLE_ONE_VALIDATION_TRANSACTION');

			if (simpleThreeVehicleEvents?.grade === 'pass') {
				response._cm_simple_three_events_pass_until_now++;
				if (rideData.agency_id === '41') response._41_simple_three_events_pass_until_now++;
				if (rideData.agency_id === '42') response._42_simple_three_events_pass_until_now++;
				if (rideData.agency_id === '43') response._43_simple_three_events_pass_until_now++;
				if (rideData.agency_id === '44') response._44_simple_three_events_pass_until_now++;
			}

			if (simpleThreeVehicleEvents?.grade === 'pass' || simpleOneValidationTransaction?.grade === 'pass') {
				response._cm_simple_three_events_or_validation_pass_until_now++;
				if (rideData.agency_id === '41') response._41_simple_three_events_or_validation_pass_until_now++;
				if (rideData.agency_id === '42') response._42_simple_three_events_or_validation_pass_until_now++;
				if (rideData.agency_id === '43') response._43_simple_three_events_or_validation_pass_until_now++;
				if (rideData.agency_id === '44') response._44_simple_three_events_or_validation_pass_until_now++;
			}

			//
		}

		return await res.send(response);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list Rides summary.' });
	}

	//
}
