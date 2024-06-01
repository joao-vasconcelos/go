/* * */

import getSession from '@/authentication/getSession';
import { ZoneModel } from '@/schemas/Zone/model';
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
		await prepareApiEndpoint({ method: 'PUT', permissions: [{ action: 'view', scope: 'zones' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Lock or unlock the requested document

	try {
		const foundDocument = await ZoneModel.findOne({ _id: { $eq: req.query._id } });
		if (!foundDocument) return await res.status(404).json({ message: `Zone with _id "${req.query._id}" not found.` });
		const updatedDocument = await ZoneModel.updateOne({ _id: { $eq: foundDocument._id } }, { is_locked: !foundDocument.is_locked }, { new: true });
		return await res.status(200).json(updatedDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot lock or unlock this Zone.' });
	}

	//
}
