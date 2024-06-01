/* * */

import getSession from '@/authentication/getSession';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'view', scope: 'lines' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// Fetch the requested document

	try {
		const foundDocument = await PatternModel.findOne({ _id: { $eq: req.query._id } }).populate('path.stop');
		if (!foundDocument) return await res.status(404).json({ message: `Pattern with _id "${req.query._id}" not found.` });
		return await res.status(200).json(foundDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot fetch this Pattern.' });
	}

	//
}
