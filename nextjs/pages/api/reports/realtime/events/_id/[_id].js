/* * */

import PCGIDB from '@/services/PCGIDB';
import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { ObjectId } from 'mongodb';

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
		await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['realtime'] }] }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 2.
	// Connect to PCGIDB

	try {
		await PCGIDB.connect();
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Could not connect to PCGIDB.' });
	}

	// 3.
	// Perform database search

	try {
		const foundDocument = await PCGIDB.VehicleEvents.findOne({ _id: { $eq: PCGIDB.toObjectId(req.query._id) } });
		return await res.status(200).json(foundDocument);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list VehicleEvents.' });
	}

	//
}