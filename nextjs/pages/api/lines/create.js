/* * */

import getSession from '@/authentication/getSession';
import { LineDefault } from '@/schemas/Line/default';
import { LineModel } from '@/schemas/Line/model';
import generator from '@/services/generator';
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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'create', scope: 'lines' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Save a new document with default values

	try {
		const newDocument = { ...LineDefault, code: generator({ length: 5 }) };
		while (await LineModel.exists({ code: newDocument.code })) {
			newDocument.code = generator({ length: 5 });
		}
		const createdDocument = await LineModel(newDocument).save();
		return await res.status(201).json(createdDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create this Line.' });
	}

	//
}
