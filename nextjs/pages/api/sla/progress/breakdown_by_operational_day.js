/* * */

import getSession from '@/authentication/getSession';
import SLAMANAGERDB from '@/services/SLAMANAGERDB';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import TIMETRACKER from '@helperkits/timer';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;

	// 2.
	// Get session data

	try {
		sessionData = await getSession(req, res);
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'create', fields: [{ key: 'kind', values: ['sla_default_v1'] }], scope: 'exports' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Connect to SLAMANAGERDB

	try {
		await SLAMANAGERDB.connect();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Could not connect to SLAMANAGERDB.' });
	}

	// 5.
	// Perform database search

	try {
		// Get all distinct operational days that have have been fully processed

		const allOperationalDays = await SLAMANAGERDB.TripAnalysis.distinct('operational_day');

		const allOperationalDaysStatuses = [];

		// For each operational day, check if there are any statuses that are not 'processed'
		// If there are, remove the operational day from the set

		for (const operationalDay of allOperationalDays) {
			//

			const countersTimer = new TIMETRACKER();

			const totalCount = await SLAMANAGERDB.TripAnalysis.countDocuments({ operational_day: operationalDay });
			const errorCount = await SLAMANAGERDB.TripAnalysis.countDocuments({ operational_day: operationalDay, status: 'error' });
			const pendingCount = await SLAMANAGERDB.TripAnalysis.countDocuments({ operational_day: operationalDay, status: 'pending' });
			const processedCount = await SLAMANAGERDB.TripAnalysis.countDocuments({ operational_day: operationalDay, status: 'processed' });
			const processingCount = await SLAMANAGERDB.TripAnalysis.countDocuments({ operational_day: operationalDay, status: 'processing' });

			allOperationalDaysStatuses.push({ _debug_timer: countersTimer.get(), error: errorCount, operational_day: operationalDay, pending: pendingCount, processed: processedCount, processing: processingCount, total: totalCount });
		}

		return await res.send(allOperationalDaysStatuses);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
