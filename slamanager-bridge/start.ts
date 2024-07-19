/* * */

import SLAMANAGERBRIDGEDB from '@/services/SLAMANAGERBRIDGEDB.js';
import SLAMANAGERBUFFERDB from '@/services/SLAMANAGERBUFFERDB.js';
import SLAMANAGERDB from '@/services/SLAMANAGERDB.js';
import LOGGER from '@helperkits/logger';
import TIMETRACKER from '@helperkits/timer';

/* * */

export default async () => {
	try {
		//

		LOGGER.init();

		const globalTimer = new TIMETRACKER();

		//
		// Connect to databases

		LOGGER.info('Connecting to databases...');

		await SLAMANAGERDB.connect();
		await SLAMANAGERBUFFERDB.connect();
		await SLAMANAGERBRIDGEDB.connect();

		LOGGER.divider();

		//
		// Create SLAMANAGERBRIDGEDB tables

		LOGGER.info('Creating TripAnalysis tables...');

		const exampleTripAnalysis = await SLAMANAGERDB.TripAnalysis.findOne();

		const tripAnalysisParsed = {
			agency_id: exampleTripAnalysis.agency_id,
			archive_id: exampleTripAnalysis.archive_id,
			code: exampleTripAnalysis.code,
			line_id: exampleTripAnalysis.line_id,
			operational_day: exampleTripAnalysis.operational_day,
			pattern_id: exampleTripAnalysis.pattern_id,
			route_id: exampleTripAnalysis.route_id,
			scheduled_start_time: exampleTripAnalysis.scheduled_start_time,
			service_id: exampleTripAnalysis.service_id,
			trip_id: exampleTripAnalysis.trip_id,
			user_notes: exampleTripAnalysis.user_notes,
		};

		exampleTripAnalysis.analysis.forEach((item) => {
			tripAnalysisParsed[`${item.code}-status`] = item.status;
			tripAnalysisParsed[`${item.code}-grade`] = item.grade;
			tripAnalysisParsed[`${item.code}-reason`] = item.reason;
			tripAnalysisParsed[`${item.code}-message`] = item.message;
			tripAnalysisParsed[`${item.code}-unit`] = item.unit;
			tripAnalysisParsed[`${item.code}-value`] = item.value;
		});

		// Get keys from object

		const keys = Object.keys(tripAnalysisParsed);

		// Create table

		await SLAMANAGERBRIDGEDB.client.query(`
			CREATE TABLE trip_analysis (
				${keys.map(key => `${key} VARCHAR(255)`).join(',')}
			);
		`);

		//

		LOGGER.terminate(`Run took ${globalTimer.get()}.`);

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
