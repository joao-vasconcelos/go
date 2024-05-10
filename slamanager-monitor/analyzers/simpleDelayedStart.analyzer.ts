/* * */

import { AnalysisData } from '@/types/analysisData';

/* * */

// This analyzer tests if there is an excess delay starting the trip.
//
// GRADES:
// → PASS = Trip start time delay is less than or equal to 10 minutes.
// → FAIL = Trip start time delay is greater than 10 minutes.

/* * */

export default (analysisData: AnalysisData) => {
	//

	try {
		//

		// 1.
		// Sort the path by stop_sequence

		const sortedTripPath = analysisData.hashed_trip.path.sort((a, b) => {
			return a.stop_sequence - b.stop_sequence;
		});

		// 2.
		// Extract the expected arrival time of the first stop of the trip

		const firstStopExpectedArrivalTime = sortedTripPath[0]?.arrival_time;

		// 1.
		// Test if at least one Vehicle Event is found

		if (analysisData.vehicle_events.length > 0 || analysisData.validation_transactions.length > 0) {
			return {
				code: 'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION_',
				status: 'COMPLETE',
				grade: 'PASS',
				reason: 'FOUND_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION',
				message: `Found ${analysisData.vehicle_events.length} Vehicle Events and ${analysisData.validation_transactions.length} Validation Transactions for this trip.`,
			};
		}

		return {
			code: 'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION_',
			status: 'COMPLETE',
			grade: 'FAIL',
			reason: 'NO_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION_FOUND',
			message: 'No Vehicle Events or Validation Transactions found for this trip.',
		};

		//
	} catch (error) {
		console.log(error);
		return {
			code: 'SIMPLE_ONE_VEHICLE_EVENT_OR_VALIDATION_TRANSACTION_',
			status: 'ERROR',
			grade: null,
			reason: null,
			message: error.message,
		};
	}

	//
};