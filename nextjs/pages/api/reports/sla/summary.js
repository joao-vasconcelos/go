/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import SLAMANAGERDB from '@/services/SLAMANAGERDB';

/* * */

export const config = { api: { responseLimit: false } };

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
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['sla'] }] }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Connect to SLAMANAGERDB

	try {
		await SLAMANAGERDB.connect();
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Could not connect to SLAMANAGERDB.' });
	}

	// 5.
	// Perform database search

	try {
		const allDocuments = await SLAMANAGERDB.TripAnalysis.find({}).limit(100).toArray();
		return await res.send(allDocuments);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}