/* * */

import SLAMANAGERDB from '@/services/SLAMANAGERDB.js';
import SLAMANAGERQUEUEDB from '@/services/SLAMANAGERQUEUEDB.js';
import TIMETRACKER from '@/services/TIMETRACKER.js';
import { AnalysisData } from '@/types/analysisData.js';

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

const ANALYSIS_BATCH_SIZE = 1;

/* * */

export default async () => {
	//

	try {
		console.log();
		console.log('------------------------');
		console.log((new Date()).toISOString());
		console.log('------------------------');
		console.log();

		const globalTimer = new TIMETRACKER();
		console.log('Starting...');

		// 1.
		// Connect to databases

		console.log();
		console.log('→ Connect to databases');

		await SLAMANAGERDB.connect();
		await SLAMANAGERQUEUEDB.connect();

		// 2.
		// Get all operational days pending analysis

		const tripAnalysisBatch = await SLAMANAGERDB.TripAnalysis.find({ status: 'queued' }).sort({ trip_id: 1 }).limit(ANALYSIS_BATCH_SIZE).toArray();

		// 3.
		// Iterate on each day

		for (const [tripAnalysisIndex, tripAnalysisData] of tripAnalysisBatch.entries()) {
			//

			const tripAnalysisTimer = new TIMETRACKER();

			// 3.5.1.
			// Get hashed path and shape for this trip

			const hashedTripData = await SLAMANAGERDB.HashedTrip.findOne({ code: tripAnalysisData.hashed_trip_code });
			const hashedShapeData = await SLAMANAGERDB.HashedShape.findOne({ code: tripAnalysisData.hashed_shape_code });

			// 3.5.2.
			// Get PCGI Vehicle Events for this trip (from an array of IDs)

			const allPcgiVehicleEventsData = await SLAMANAGERQUEUEDB.QueueData.find({ operational_day: tripAnalysisData.operational_day, trip_id: tripAnalysisData.trip_id, type: 'vehicle_event' }).toArray();
			const allPcgiValidationTransactionsData = await SLAMANAGERQUEUEDB.QueueData.find({ operational_day: tripAnalysisData.operational_day, trip_id: tripAnalysisData.trip_id, type: 'validation_transaction' }).toArray();
			const allPcgiLocationTransactionsData = await SLAMANAGERQUEUEDB.QueueData.find({ operational_day: tripAnalysisData.operational_day, trip_id: tripAnalysisData.trip_id, type: 'location_transaction' }).toArray();

			// 3.5.5.
			// Build the analysis data, common to all analyzers

			const allPcgiVehicleEventsParsed = allPcgiVehicleEventsData.map(item => JSON.parse(item.data));
			const allPcgiValidationTransactionsParsed = allPcgiValidationTransactionsData.map(item => JSON.parse(item.data));
			const allPcgiLocationTransactionsParsed = allPcgiLocationTransactionsData.map(item => JSON.parse(item.data));

			// 3.5.5.
			// Build the analysis data, common to all analyzers

			const analysisData: AnalysisData = {
				hashed_shape: hashedShapeData,
				hashed_trip: hashedTripData,
				location_transactions: allPcgiLocationTransactionsParsed,
				validation_transactions: allPcgiValidationTransactionsParsed,
				vehicle_events: allPcgiVehicleEventsParsed,
			};

			// 3.5.6.
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

			// 3.5.7.
			// Count how many analysis passed and how many failed

			const passAnalysisCount = tripAnalysisData.analysis.filter(item => item.grade === 'PASS');

			const failAnalysisCount = tripAnalysisData.analysis.filter(item => item.grade === 'FAIL');

			const errorAnalysisCount = tripAnalysisData.analysis.filter(item => item.grade === 'ERROR').map(item => item.code);

			// 3.5.8.
			// Update trip with analysis result and status

			tripAnalysisData.status = 'processed';

			await SLAMANAGERDB.TripAnalysis.findOneAndReplace({ code: tripAnalysisData.code }, tripAnalysisData);

			//

			console.log(`[${tripAnalysisIndex + 1}/${tripAnalysisBatch.length}] | ${tripAnalysisData.code} (${tripAnalysisTimer.get()}) | PASS: ${passAnalysisCount.length} | FAIL: ${failAnalysisCount.length} | ERROR: ${errorAnalysisCount.length} [${errorAnalysisCount.join('|')}]`);

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
