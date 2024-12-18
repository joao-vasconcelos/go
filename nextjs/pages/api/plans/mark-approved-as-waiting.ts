/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { plans } from '@tmlmobilidade/services/interfaces';

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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'admin', scope: 'configs' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// List all documents

	try {
		const plansCollection = await plans.getCollection();
		const result = await plansCollection.updateMany({ is_approved: true }, { $set: { feeder_status: 'waiting' } });
		return await res.status(200).send(result);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Plans.' });
	}

	//
}
