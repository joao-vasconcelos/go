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
				code: 'SIMPLE_ONE_VALIDATION_TRANSACTION',
				grade: 'PASS',
				message: `Found ${analysisData.validation_transactions.length} Validation Transactions for this trip.`,
				reason: 'FOUND_AT_LEAST_ONE_VALIDATION_TRANSACTION',
				status: 'COMPLETE',
			};
		}

		return {
			code: 'SIMPLE_ONE_VALIDATION_TRANSACTION',
			grade: 'FAIL',
			message: 'No Validation Transactions found for this trip.',
			reason: 'NO_VALIDATION_TRANSACTION_FOUND',
			status: 'COMPLETE',
		};

		//
	}
	catch (error) {
		console.log(error);
		return {
			code: 'SIMPLE_ONE_VALIDATION_TRANSACTION',
			grade: null,
			message: error.message,
			reason: null,
			status: 'ERROR',
		};
	}

	//
};
