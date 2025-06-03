/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { plans } from '@tmlmobilidade/interfaces';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;
	let planDocument;

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
		await prepareApiEndpoint({ method: 'PUT', permissions: [{ action: 'edit', scope: 'plans' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Parse request body into JSON

	try {
		req.body = await JSON.parse(req.body);
	}
	catch (error) {
		console.log(error);
		await res.status(500).json({ message: 'JSON parse error.' });
		return;
	}

	// 6.
	// Retrieve requested document from the database

	try {
		planDocument = await plans.findById(req.query._id);
		if (!planDocument) return await res.status(404).json({ message: `Plan with _id "${req.query._id}" not found.` });
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Plan not found.' });
	}

	// 9.
	// Check if document is locked

	if (planDocument.is_locked) {
		return await res.status(423).json({ message: 'Plan is locked.' });
	}

	// 10.
	// Update the requested document

	try {
		const editedDocument = await plans.updateById(req.query._id, req.body);
		if (!editedDocument) return await res.status(404).json({ message: `Plan with _id "${req.query._id}" not found.` });
		return await res.status(200).json(editedDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(error.statusCode || 500).json({ message: error.message || 'Cannot update this Plan.' });
	}

	//
}
