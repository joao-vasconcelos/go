/* * */

import getSession from '@/authentication/getSession';
import { DeletedStopModel, StopModel } from '@/schemas/Stop/model';
import { StopValidation } from '@/schemas/Stop/validation';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;
	let foundDocument;

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
		await prepareApiEndpoint({ method: 'PUT', permissions: [{ action: 'view', scope: 'stops' }], request: req, session: sessionData });
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
		req.body = StopValidation.cast(req.body);
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: JSON.parse(error.message)[0].message });
	}

	// 6.
	// Retrieve requested document from the database

	try {
		foundDocument = await StopModel.findOne({ _id: { $eq: req.query._id } });
		if (!foundDocument) return await res.status(404).json({ message: `Stop with _id "${req.query._id}" not found.` });
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Stop not found.' });
	}

	// 7.
	// Check if document is locked

	if (foundDocument.is_locked) {
		return await res.status(423).json({ message: 'Stop is locked.' });
	}

	// 8.
	// Check for uniqueness

	try {
		// The values that need to be unique are ['code'].
		const foundDocumentWithStopCode = await StopModel.exists({ code: { $eq: req.body.code } });
		if (foundDocumentWithStopCode && foundDocumentWithStopCode._id != req.query._id) {
			throw new Error('A Stop with the same "code" already exists.');
		}
		// The stop code cannot be reused by previously deleted stops
		const foundDeletedDocumentWithStopCode = await DeletedStopModel.exists({ code: { $eq: req.body.code } });
		if (foundDeletedDocumentWithStopCode) {
			throw new Error('A Deleted Stop with the same "code" was found. You have to use a different code.');
		}
	}
	catch (error) {
		console.log(error);
		return await res.status(409).json({ message: error.message });
	}

	// 9.
	// Update the requested document

	try {
		const editedDocument = await StopModel.replaceOne({ _id: { $eq: req.query._id } }, req.body, { new: true });
		if (!editedDocument) return await res.status(404).json({ message: `Stop with _id "${req.query._id}" not found.` });
		return await res.status(200).json(editedDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot update this Stop.' });
	}

	//
}
