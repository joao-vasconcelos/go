/* * */

import { AnalysisData } from '@/types/analysisData';

/* * */

// This analyzer tests if at the trip has less than ten Vehicle Events.
//
// GRADES:
// → PASS = More than ten Vehicle Events found for the trip.
// → FAIL = Less than or equal to ten Vehicle Events found for the trip.

/* * */

export default (analysisData: AnalysisData) => {
	//

	try {
		//

		// 1.
		// Test if the trip has more than ten Vehicle Events

		if (analysisData.vehicle_events.length > 10) {
			return {
				code: 'LESS_THAN_TEN_VEHICLE_EVENTS',
				status: 'COMPLETE',
				grade: 'PASS',
				reason: 'FOUND_MORE_THAN_10_VEHICLE_EVENTS',
				message: `Found ${analysisData.vehicle_events.length} Vehicle Events for this trip.`,
			};
		}

		if (analysisData.vehicle_events.length === 1) {
			return {
				code: 'LESS_THAN_TEN_VEHICLE_EVENTS',
				status: 'COMPLETE',
				grade: 'FAIL',
				reason: 'FOUND_ONLY_1_VEHICLE_EVENT',
				message: `Found ${analysisData.vehicle_events.length} Vehicle Events for this trip.`,
			};
		}

		return {
			code: 'LESS_THAN_TEN_VEHICLE_EVENTS',
			status: 'COMPLETE',
			grade: 'FAIL',
			reason: `FOUND_ONLY_${analysisData.vehicle_events.length}_VEHICLE_EVENTS`,
			message: 'No Vehicle Events or Validation Transactions found for this trip.',
		};

		//
	} catch (error) {
		console.log(error);
		return {
			code: 'LESS_THAN_TEN_VEHICLE_EVENTS',
			status: 'ERROR',
			grade: null,
			reason: null,
			message: error.message,
		};
	}

	//
};