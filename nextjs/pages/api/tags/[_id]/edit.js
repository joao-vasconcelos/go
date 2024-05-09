/* * */

import mongodb from '@/services/OFFERMANAGERDB';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import { TagValidation } from '@/schemas/Tag/validation';
import { TagModel } from '@/schemas/Tag/model';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;
	let foundDocument;

	// 2.
	// Refuse request if not PUT

	if (req.method != 'PUT') {
		await res.setHeader('Allow', ['PUT']);
		return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
	}

	// 3.
	// Check for correct Authentication and valid Permissions

	try {
		sessionData = await getSession(req, res);
		isAllowed(sessionData, [{ scope: 'tags', action: 'edit' }]);
	} catch (error) {
		console.log(error);
		return await res.status(401).json({ message: error.message || 'Could not verify Authentication.' });
	}

	// 4.
	// Connect to MongoDB

	try {
		await mongodb.connect();
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'MongoDB connection error.' });
	}

	// 5.
	// Ensure latest schema modifications are applied in the database

	try {
		await TagModel.syncIndexes();
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot sync indexes.' });
	}

	// 6.
	// Parse request body into JSON

	try {
		req.body = await JSON.parse(req.body);
	} catch (error) {
		console.log(error);
		await res.status(500).json({ message: 'JSON parse error.' });
		return;
	}

	// 7.
	// Validate req.body against schema

	try {
		req.body = TagValidation.cast(req.body);
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: JSON.parse(error.message)[0].message });
	}

	// 8.
	// Retrieve requested document from the database

	try {
		foundDocument = await TagModel.findOne({ _id: { $eq: req.query._id } });
		if (!foundDocument) return await res.status(404).json({ message: `Tag with _id "${req.query._id}" not found.` });
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Tag not found.' });
	}

	// 9.
	// Check if document is locked

	if (foundDocument.is_locked) {
		return await res.status(423).json({ message: 'Tag is locked.' });
	}

	// 10.
	// Check for uniqueness

	try {
		// The values that need to be unique are ['label'].
		const foundDocumentWithTagCode = await TagModel.exists({ label: { $eq: req.body.label } });
		if (foundDocumentWithTagCode && foundDocumentWithTagCode._id != req.query._id) {
			throw new Error('An Tag with the same "label" already exists.');
		}
	} catch (error) {
		console.log(error);
		return await res.status(409).json({ message: error.message });
	}

	// 11.
	// Update the requested document

	try {
		const editedDocument = await TagModel.replaceOne({ _id: { $eq: req.query._id } }, req.body, { new: true });
		if (!editedDocument) return await res.status(404).json({ message: `Tag with _id "${req.query._id}" not found.` });
		return await res.status(200).json(editedDocument);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot update this Tag.' });
	}

	//
}