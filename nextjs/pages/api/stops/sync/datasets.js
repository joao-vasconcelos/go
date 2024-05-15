/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import stopsSyncDatasets from '@/scripts/stops/stops.sync.datasets';

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
		await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Update stops

	try {
		await stopsSyncDatasets();
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Sync Error' });
	}

	// 5.
	// Log progress
	console.log(`⤷ Done. Sending response to client...`);
	return await res.status(200).json('Sync complete.');

	//
}