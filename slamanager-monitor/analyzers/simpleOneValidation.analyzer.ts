/* * */

import { AnalysisData } from '@/types/analysisData';

/* * */

// This analyzer tests if at least one validation is found for the trip.
//
// GRADES:
// → PASS = At least one Validation Transaction is found for the trip.
// → FAIL = No Validation Transactions found for the trip.

/* * */

export default (analysisData: AnalysisData) => {
	//

	try {
		//

		// 1.
		// Test if at least one Validation Transaction is found

		if (analysisData.validation_transactions.length > 0) {
			return {
				code: 'SIMPLE_ONE_VALIDATION/1.0.0',
				status: 'COMPLETE',
				grade: 'PASS',
				reason: 'FOUND_AT_LEAST_ONE_VALIDATION_TRANSACTION',
				message: `Found ${analysisData.validation_transactions.length} Validation Transactions for this trip.`,
			};
		}

		return {
			code: 'SIMPLE_ONE_VALIDATION/1.0.0',
			status: 'COMPLETE',
			grade: 'FAIL',
			reason: 'NO_VALIDATION_TRANSACTION_FOUND',
			message: 'No Validation Transactions found for this trip.',
		};

		//
	} catch (error) {
		console.log(error);
		return {
			code: 'SIMPLE_ONE_VALIDATION/1.0.0',
			status: 'ERROR',
			grade: null,
			reason: null,
			message: error.message,
		};
	}

	//
};