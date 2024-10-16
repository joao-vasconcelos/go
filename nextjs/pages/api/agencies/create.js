/* * */

import getSession from '@/authentication/getSession';
import { AgencyDefault } from '@/schemas/Agency/default';
import { AgencyModel } from '@/schemas/Agency/model';
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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'create', scope: 'agencies' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Save a new document with default values

	try {
		const newDocument = { ...AgencyDefault, code: generator({ length: 2 }) };
		while (await AgencyModel.exists({ code: newDocument.code })) {
			newDocument.code = generator({ length: 2 });
		}
		const createdDocument = await AgencyModel(newDocument).save();
		return await res.status(201).json(createdDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create this Agency.' });
	}

	//
}
