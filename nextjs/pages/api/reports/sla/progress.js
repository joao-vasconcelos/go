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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'view', fields: [{ key: 'kind', values: ['sla'] }], scope: 'reports' }], request: req, session: sessionData });
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
		const totalDocuments = await SLAMANAGERDB.TripAnalysis.countDocuments({});
		const totalPendingDocuments = await SLAMANAGERDB.TripAnalysis.countDocuments({ status: 'pending' });
		return await res.send({ _progress: (1 - (totalPendingDocuments / totalDocuments)) * 100, pending: totalPendingDocuments, total: totalDocuments });
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
