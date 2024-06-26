/* * */

import SLAMANAGERBUFFERDB from '@/services/SLAMANAGERBUFFERDB.js';
import SLAMANAGERDB from '@/services/SLAMANAGERDB.js';
import { AnalysisData } from '@/types/analysisData.js';
import LOGGER from '@helperkits/logger';
import TIMETRACKER from '@helperkits/timer';

/* * */

import atMostTwoDriverIdsAnalyzer from '@/analyzers/atMostTwoDriverIds.analyzer.js';
import atMostTwoVehicleIdsAnalyzer from '@/analyzers/atMostTwoVehicleIds.analyzer.js';
import lessThanTenVehicleEventsAnalyzer from '@/analyzers/lessThanTenVehicleEvents.analyzer.js';
import matchingLocationTransactionsAnalyzer from '@/analyzers/matchingLocationTransactions.analyzer.js';
import simpleOneValidationTransactionAnalyzer from '@/analyzers/simpleOneValidationTransaction.analyzer.js';
import simpleOneVehicleEventOrValidationTransactionAnalyzer from '@/analyzers/simpleOneVehicleEventOrValidationTransaction.analyzer.js';
import simpleThreeVehicleEventsAnalyzer from '@/analyzers/simpleThreeVehicleEvents.analyzer.js';
// import simpleDelayedStartAnalyzer from '@/analyzers/simpleDelayedStart.analyzer.js';

/* * */

const ANALYSIS_BATCH_SIZE = 1000;

/* * */

export default async () => {
	try {
		//

		LOGGER.init();

		const globalTimer = new TIMETRACKER();

		// 1.
		// Connect to databases

		LOGGER.info('Connecting to databases...');

		await SLAMANAGERDB.connect();
		await SLAMANAGERBUFFERDB.connect();

		// 2.
		// Get all operational days that are already buffered

		const bufferedOperationalDays = await SLAMANAGERBUFFERDB.OperationalDayStatus.distinct('operational_day', { location_transaction_synced: true, validation_transaction_synced: true, vehicle_event_synced: true });

		if (bufferedOperationalDays.length === 0) {
			LOGGER.error('No operational days are buffered yet.');
		}

		// 3.
		// Get all trips pending analysis that are from the buffered operational days

		const tripAnalysisBatch = await SLAMANAGERDB.TripAnalysis.find({ operational_day: { $in: bufferedOperationalDays }, status: 'pending' }).sort({ trip_id: 1 }).limit(ANALYSIS_BATCH_SIZE).toArray();

		if (tripAnalysisBatch.length === 0) {
			LOGGER.error('No trips are pending analysis.');
		}

		// 4.
		// Iterate on each day

		for (const [tripAnalysisIndex, tripAnalysisData] of tripAnalysisBatch.entries()) {
			//

			const tripAnalysisTimer = new TIMETRACKER();

			// 4.1.
			// Get HashedShape and HashedTrip for this trip

			const hashedShapeData = await SLAMANAGERDB.HashedShape.findOne({ code: tripAnalysisData.hashed_shape_code });
			const hashedTripData = await SLAMANAGERDB.HashedTrip.findOne({ code: tripAnalysisData.hashed_trip_code });

			// 4.2.
			// Get transactions and events for this trip

			const allLocationTransactionsData = await SLAMANAGERBUFFERDB.BufferData.find({ operational_day: tripAnalysisData.operational_day, trip_id: tripAnalysisData.trip_id, type: 'location_transaction' }).toArray();
			const allLocationTransactionsParsed = allLocationTransactionsData.map(item => JSON.parse(item.data));

			const allValidationTransactionsData = await SLAMANAGERBUFFERDB.BufferData.find({ operational_day: tripAnalysisData.operational_day, trip_id: tripAnalysisData.trip_id, type: 'validation_transaction' }).toArray();
			const allValidationTransactionsParsed = allValidationTransactionsData.map(item => JSON.parse(item.data));

			const allVehicleEventsData = await SLAMANAGERBUFFERDB.BufferData.find({ operational_day: tripAnalysisData.operational_day, trip_id: tripAnalysisData.trip_id, type: 'vehicle_event' }).toArray();
			const allVehicleEventsParsed = allVehicleEventsData.map(item => JSON.parse(item.data));

			// 4.3.
			// Build the analysis data, common to all analyzers

			const analysisData: AnalysisData = {
				hashed_shape: hashedShapeData,
				hashed_trip: hashedTripData,
				location_transactions: allLocationTransactionsParsed,
				validation_transactions: allValidationTransactionsParsed,
				vehicle_events: allVehicleEventsParsed,
			};

			// 4.4.
			// Run the analyzers

			tripAnalysisData.analysis = [

				/* * * * */

				simpleOneVehicleEventOrValidationTransactionAnalyzer(analysisData),

				simpleOneValidationTransactionAnalyzer(analysisData),

				simpleThreeVehicleEventsAnalyzer(analysisData),

				lessThanTenVehicleEventsAnalyzer(analysisData),

				atMostTwoDriverIdsAnalyzer(analysisData),

				atMostTwoVehicleIdsAnalyzer(analysisData),

				matchingLocationTransactionsAnalyzer(analysisData),

				// simpleDelayedStartAnalyzer(analysisData),

				/* * * * */

			];

			// 4.5.
			// Count how many analysis passed and how many failed

			const passAnalysisCount = tripAnalysisData.analysis.filter(item => item.grade === 'PASS');

			const failAnalysisCount = tripAnalysisData.analysis.filter(item => item.grade === 'FAIL');

			const errorAnalysisCount = tripAnalysisData.analysis.filter(item => item.grade === 'ERROR').map(item => item.code);

			// 4.6.
			// Update trip with analysis result and status

			tripAnalysisData.status = 'processed';

			await SLAMANAGERDB.TripAnalysis.replaceOne({ code: tripAnalysisData.code }, tripAnalysisData);

			//

			LOGGER.success(`[${tripAnalysisIndex + 1}/${tripAnalysisBatch.length}] | ${tripAnalysisData.code} (${tripAnalysisTimer.get()}) | PASS: ${passAnalysisCount.length} | FAIL: ${failAnalysisCount.length} | ERROR: ${errorAnalysisCount.length} [${errorAnalysisCount.join('|')}]`);

			//
		}

		//

		console.log();
		console.log('- - - - - - - - - - - - - - - - - - - - -');
		console.log(`Run took ${globalTimer.get()}.`);
		console.log('- - - - - - - - - - - - - - - - - - - - -');
		console.log();

		//
	}
	catch (err) {
		console.log('An error occurred. Halting execution.', err);
		console.log('Retrying in 10 seconds...');
		setTimeout(() => {
			process.exit(0); // End process
		}, 10000); // after 10 seconds
	}

	//
};
