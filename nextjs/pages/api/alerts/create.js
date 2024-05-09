/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import generator from '@/services/generator';
import { AlertDefault } from '@/schemas/Alert/default';
import { AlertModel } from '@/schemas/Alert/model';

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
		await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'alerts', action: 'view' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// Save a new document with default values

	try {
		const newDocument = { ...AlertDefault, created_by: sessionData.user._id, code: generator({ length: 8 }) };
		while (await AlertModel.exists({ code: newDocument.code })) {
			newDocument.code = generator({ length: 8 });
		}
		const createdDocument = await AlertModel(newDocument).save();
		return await res.status(201).json(createdDocument);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create this Alert.' });
	}

	//
}