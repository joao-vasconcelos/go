/* * */

import getSession from '@/authentication/getSession';
import { RouteModel } from '@/schemas/Route/model';
import { RouteValidation } from '@/schemas/Route/validation';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;
	let routeDocument;

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
		await prepareApiEndpoint({ method: 'PUT', permissions: [{ action: 'edit', scope: 'lines' }], request: req, session: sessionData });
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

	// 5.
	// Validate req.body against schema

	try {
		req.body = RouteValidation.cast(req.body);
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: JSON.parse(error.message)[0].message });
	}

	// 6.
	// Retrieve requested document from the database

	try {
		routeDocument = await RouteModel.findOne({ _id: { $eq: req.query._id } });
		if (!routeDocument) return await res.status(404).json({ message: `Route with _id "${req.query._id}" not found.` });
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Route not found.' });
	}

	// 7.
	// Check for uniqueness

	try {
		// The values that need to be unique are ['code'].
		const foundDocumentWithRouteCode = await RouteModel.exists({ code: { $eq: req.body.code } });
		if (foundDocumentWithRouteCode && foundDocumentWithRouteCode._id != req.query._id) {
			throw new Error('An Route with the same "code" already exists.');
		}
	}
	catch (error) {
		console.log(error);
		return await res.status(409).json({ message: error.message });
	}

	// 8.
	// Check if document is locked

	if (routeDocument.is_locked) {
		return await res.status(423).json({ message: 'Route is locked.' });
	}

	// 9.
	// Update the requested document

	try {
		const editedDocument = await RouteModel.updateOne({ _id: { $eq: req.query._id } }, req.body, { new: true });
		if (!editedDocument) return await res.status(404).json({ message: `Route with _id "${req.query._id}" not found.` });
		return await res.status(200).json(editedDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot update this Route.' });
	}

	//
}
