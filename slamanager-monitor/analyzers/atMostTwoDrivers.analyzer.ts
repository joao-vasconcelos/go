/* * */

import { AnalysisData } from '@/types/analysisData';

/* * */

// This analyzer tests if the trip has at most two drivers (at least one, maximum of two).
//
// GRADES:
// → PASS = At least one Driver, and maximum two Driver for the trip.
// → FAIL = No Driver or more than two Drivers for the trip.

/* * */

export default (analysisData: AnalysisData) => {
	//

	try {
		//

		// 1.
		// Initiate a Set

		const foundDriverIds = new Set;

		// 2.
		// Test for how many driver IDs are found

		for (const event of analysisData.vehicle_events) {
			foundDriverIds.add(event.content.entity[0].vehicle.vehicle.driverId);
		}

		if (foundDriverIds.size === 0) {
			return {
				code: 'AT_MOST_TWO_DRIVERS/1.0.0',
				status: 'COMPLETE',
				grade: 'FAIL',
				reason: 'NO_DRIVER_ID_FOUND',
				message: 'No Driver IDs found for this trip.',
			};
		}

		if (foundDriverIds.size > 2) {
			return {
				code: 'AT_MOST_TWO_DRIVERS/1.0.0',
				status: 'COMPLETE',
				grade: 'FAIL',
				reason: 'FOUND_MORE_THAN_2_DRIVER_IDS',
				message: `Found ${foundDriverIds.size} Driver IDs for this trip.`,
			};
		}

		return {
			code: 'AT_MOST_TWO_DRIVERS/1.0.0',
			status: 'COMPLETE',
			grade: 'PASS',
			reason: 'FOUND_ONE_OR_TWO_DRIVER_IDS',
			message: `Found ${foundDriverIds.size} Driver IDs for this trip.`,
		};

		//
	} catch (error) {
		console.log(error);
		return {
			code: 'AT_MOST_TWO_DRIVERS/1.0.0',
			status: 'ERROR',
			grade: null,
			reason: null,
			message: error.message,
		};
	}

	//
};