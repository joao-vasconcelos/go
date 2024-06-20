/* * */

import { AnalysisData } from '@/types/analysisData';

/* * */

// This analyzer tests if at least one vehicle event or one validation is found for the trip.
//
// GRADES:
// → PASS = At least one Vehicle Event OR one Validation Transaction is found for the trip.
// → FAIL = No Vehicle Events OR Validation Transactions found for the trip.

/* * */

export default (analysisData: AnalysisData) => {
	//

	try {
		//

		// 1.
		// Test if at least one Vehicle Event is found

		if (analysisData.vehicle_events.length > 0 || analysisData.validation_transactions.length > 0) {
			return {
				code: 'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION',
				grade: 'PASS',
				message: `Found ${analysisData.vehicle_events.length} Vehicle Events and ${analysisData.validation_transactions.length} Validation Transactions for this trip.`,
				reason: 'FOUND_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION',
				status: 'COMPLETE',
			};
		}

		return {
			code: 'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION',
			grade: 'FAIL',
			message: 'No Vehicle Events or Validation Transactions found for this trip.',
			reason: 'NO_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION_FOUND',
			status: 'COMPLETE',
		};

		//
	}
	catch (error) {
		console.log(error);
		return {
			code: 'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION',
			grade: null,
			message: error.message,
			reason: null,
			status: 'ERROR',
		};
	}

	//
};
