/* * */

import getSession from '@/authentication/getSession';
import { PatternModel } from '@/schemas/Pattern/model';
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

	// 4.
	// Fetch the correct document

	try {
		const foundDocumentsOn = await PatternModel.find({ 'schedules.calendars_on': { $eq: req.query._id } }, '_id code headsign parent_route');
		const foundDocumentsOff = await PatternModel.find({ 'schedules.calendars_off': { $eq: req.query._id } }, '_id code headsign parent_route');
		return await res.status(200).json([...foundDocumentsOn, ...foundDocumentsOff]);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot fetch associated Patterns for this Calendar.' });
	}

	//
}
