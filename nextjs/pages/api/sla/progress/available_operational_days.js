/* * */

import getSession from '@/authentication/getSession';
import SLAMANAGERDB from '@/services/SLAMANAGERDB';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

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
		const allOperationalDaysSet = new Set(allOperationalDays);

		// For each operational day, check if there are any statuses that are not 'processed'
		// If there are, remove the operational day from the set

		for (const operationalDay of allOperationalDays) {
			const statuses = await SLAMANAGERDB.TripAnalysis.distinct('status', { operational_day: operationalDay });
			const statusesSet = new Set(statuses);
			// If the only status found is 'processed', then the operational day is fully processed
			if ((statusesSet.has('processed') && statusesSet.size === 1)) {
				continue;
			}
			// Remove the day otherwise
			allOperationalDaysSet.delete(operationalDay);
		}

		const fullyProcessedOperationalDays = Array.from(allOperationalDaysSet);

		return await res.send(fullyProcessedOperationalDays);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
