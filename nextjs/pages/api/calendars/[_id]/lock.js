/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { CalendarModel } from '@/schemas/Calendar/model';

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
		await prepareApiEndpoint({ request: req, method: 'PUT', session: sessionData, permissions: [{ scope: 'calendars', action: 'lock' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Lock or unlock the requested document

	try {
		const foundDocument = await CalendarModel.findOne({ _id: { $eq: req.query._id } });
		if (!foundDocument) return await res.status(404).json({ message: `Calendar with _id "${req.query._id}" not found.` });
		const updatedDocument = await CalendarModel.updateOne({ _id: { $eq: foundDocument._id } }, { is_locked: !foundDocument.is_locked }, { new: true });
		return await res.status(200).json(updatedDocument);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot lock or unlock this Calendar.' });
	}

	//
}