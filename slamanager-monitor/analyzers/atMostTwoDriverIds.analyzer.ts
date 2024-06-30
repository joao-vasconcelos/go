/* eslint-disable perfectionist/sort-objects */

/* * */

import { AnalysisData } from '@/types/analysisData.type.js';
import { AnalysisResult, AnalysisResultGrade, AnalysisResultStatus } from '@/types/analysisResult.type.js';

/* * */

// This analyzer tests if the trip has at most two drivers (at least one, maximum of two).
//
// GRADES:
// → PASS = At least one Driver, and maximum two Driver IDs for the trip.
// → FAIL = No Driver or more than two Drivers IDs for the trip.

/* * */

interface ExtendedAnalysisResult extends AnalysisResult {
	code: 'AT_MOST_TWO_DRIVER_IDS'
	reason: 'FOUND_MORE_THAN_2_DRIVER_IDS' | 'FOUND_ONE_OR_TWO_DRIVER_IDS' | 'NO_DRIVER_ID_FOUND'
	unit: 'UNIQUE_DRIVER_IDS' | null
	value: null | number
};

/* * */

export default (analysisData: AnalysisData): ExtendedAnalysisResult => {
	//

	try {
		//

		// 1.
		// Initiate a Set

		const foundDriverIds = new Set();

		// 2.
		// Test for how many driver IDs are found

		for (const event of analysisData.vehicle_events) {
			foundDriverIds.add(event.content.entity[0].vehicle.vehicle.driverId);
		}

		if (foundDriverIds.size === 0) {
			return {
				code: 'AT_MOST_TWO_DRIVER_IDS',
				status: AnalysisResultStatus.COMPLETE,
				grade: AnalysisResultGrade.FAIL,
				reason: 'NO_DRIVER_ID_FOUND',
				message: 'No Driver IDs found for this trip.',
				unit: 'UNIQUE_DRIVER_IDS',
				value: 0,
			};
		}

		if (foundDriverIds.size > 2) {
			return {
				code: 'AT_MOST_TWO_DRIVER_IDS',
				status: AnalysisResultStatus.COMPLETE,
				grade: AnalysisResultGrade.FAIL,
				reason: 'FOUND_MORE_THAN_2_DRIVER_IDS',
				message: `Found ${foundDriverIds.size} Driver IDs for this trip.`,
				unit: 'UNIQUE_DRIVER_IDS',
				value: foundDriverIds.size,
			};
		}

		return {
			code: 'AT_MOST_TWO_DRIVER_IDS',
			status: AnalysisResultStatus.COMPLETE,
			grade: AnalysisResultGrade.PASS,
			reason: 'FOUND_ONE_OR_TWO_DRIVER_IDS',
			message: `Found ${foundDriverIds.size} Driver IDs for this trip.`,
			unit: 'UNIQUE_DRIVER_IDS',
			value: foundDriverIds.size,
		};

		//
	}
	catch (error) {
		console.log(error);
		return {
			code: 'AT_MOST_TWO_DRIVER_IDS',
			status: AnalysisResultStatus.ERROR,
			grade: null,
			reason: null,
			message: error.message,
			unit: null,
			value: null,
		};
	}

	//
};
