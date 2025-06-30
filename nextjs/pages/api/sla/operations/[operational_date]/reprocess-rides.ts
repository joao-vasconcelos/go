/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { rides } from '@tmlmobilidade/interfaces';
import { ProcessingStatus } from '@tmlmobilidade/types';

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
	// Connect to mongodb

	try {
		const requestedOperationalDate = req.query.operational_date.slice(0, 8);
		const ridesCollection = await rides.getCollection();
		const result = await ridesCollection.updateMany({ operational_date: { $eq: requestedOperationalDate } }, { $set: { system_status: ProcessingStatus.Waiting } });
		return await res.status(200).json(result);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Error updating documents.' });
	}

	//
}
