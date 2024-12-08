/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import TIMETRACKER from '@helperkits/timer';
import { rides } from '@tmlmobilidade/services/interfaces';

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

	// 5.
	// Perform database search

	try {
		// Get all distinct operational days that have have been fully processed

		const allOperationalDays = await rides.distinct('operational_date');

		const allOperationalDaysStatuses: { _debug_timer: string, error: number, operational_date: string, pending: number, processed: number, processing: number, total: number }[] = [];

		// For each operational day, check if there are any statuses that are not 'processed'
		// If there are, remove the operational day from the set

		for (const operationalDay of allOperationalDays) {
			//

			const countersTimer = new TIMETRACKER();

			const totalCount = await rides.count({ operational_date: operationalDay });
			const errorCount = await rides.count({ operational_date: operationalDay, status: 'error' });
			const pendingCount = await rides.count({ operational_date: operationalDay, status: 'pending' });
			const processedCount = await rides.count({ operational_date: operationalDay, status: 'complete' });
			const processingCount = await rides.count({ operational_date: operationalDay, status: 'processing' });

			allOperationalDaysStatuses.push({ _debug_timer: countersTimer.get(), error: errorCount, operational_date: operationalDay, pending: pendingCount, processed: processedCount, processing: processingCount, total: totalCount });
		}

		return await res.send(allOperationalDaysStatuses);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
