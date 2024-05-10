/* * */

import { AnalysisData } from '@/types/analysisData';

/* * */

// This analyzer tests if the trip has at most two vehicle IDs (at least one, maximum of two).
//
// GRADES:
// → PASS = At least one Vehicle, and maximum two Vehicle IDs for the trip.
// → FAIL = No Vehicle or more than two Vehicle IDs for the trip.

/* * */

export default (analysisData: AnalysisData) => {
	//

	try {
		//

		// 1.
		// Initiate a Set

		const foundVehicleIds = new Set;

		// 2.
		// Test for how many driver IDs are found

		for (const event of analysisData.vehicle_events) {
			foundVehicleIds.add(event.content.entity[0].vehicle.vehicle._id);
		}

		if (foundVehicleIds.size === 0) {
			return {
				code: 'AT_MOST_TWO_VEHICLE_IDS',
				status: 'COMPLETE',
				grade: 'FAIL',
				reason: 'NO_VEHICLE_ID_FOUND',
				message: 'No Vehicle IDs found for this trip.',
			};
		}

		if (foundVehicleIds.size > 2) {
			return {
				code: 'AT_MOST_TWO_VEHICLE_IDS',
				status: 'COMPLETE',
				grade: 'FAIL',
				reason: 'FOUND_MORE_THAN_2_VEHICLE_IDS',
				message: `Found ${foundVehicleIds.size} Vehicle IDs for this trip.`,
			};
		}

		return {
			code: 'AT_MOST_TWO_VEHICLE_IDS',
			status: 'COMPLETE',
			grade: 'PASS',
			reason: 'FOUND_ONE_OR_TWO_VEHICLE_IDS',
			message: `Found ${foundVehicleIds.size} Vehicle IDs for this trip.`,
		};

		//
	} catch (error) {
		console.log(error);
		return {
			code: 'AT_MOST_TWO_VEHICLE_IDS',
			status: 'ERROR',
			grade: null,
			reason: null,
			message: error.message,
		};
	}

	//
};