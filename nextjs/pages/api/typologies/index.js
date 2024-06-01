/* * */

import getSession from '@/authentication/getSession';
import { TypologyModel } from '@/schemas/Typology/model';
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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'view', scope: 'typologies' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Ensure latest schema modifications are applied in the database

	try {
		await TypologyModel.syncIndexes();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot sync indexes.' });
	}

	// 5.
	// List all documents

	try {
		const allDocuments = await TypologyModel.find();
		return await res.status(200).send(allDocuments);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Typologies.' });
	}

	//
}
