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

		const fullyProcessedOperationalDays = await SLAMANAGERDB.TripAnalysis.aggregate([
			{ $group: { _id: '$operational_day', uniqueStatuses: { $addToSet: '$status' } } },
			{ $match: { uniqueStatuses: { $eq: ['processed'] } } },
			{ $project: { _id: 0, operational_day: '$_id' } },
		]).toArray();

		const fullyProcessedOperationalDaysString = fullyProcessedOperationalDays.map(item => item.operational_day);

		return await res.send(fullyProcessedOperationalDaysString);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
