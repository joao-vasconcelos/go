/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { CalendarValidation } from '@/schemas/Calendar/validation';
import { CalendarModel } from '@/schemas/Calendar/model';

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
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ request: req, method: 'PUT', session: sessionData, permissions: [{ scope: 'calendars', action: 'edit' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Parse request body into JSON

	try {
		req.body = await JSON.parse(req.body);
	} catch (error) {
		console.log(error);
		await res.status(500).json({ message: 'JSON parse error.' });
		return;
	}

	// 5.
	// Validate req.body against schema

	try {
		req.body = CalendarValidation.cast(req.body);
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: JSON.parse(error.message)[0].message });
	}

	// 6.
	// Retrieve requested document from the database

	try {
		foundDocument = await CalendarModel.findOne({ _id: { $eq: req.query._id } });
		if (!foundDocument) return await res.status(404).json({ message: `Calendar with _id "${req.query._id}" not found.` });
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Calendar not found.' });
	}

	// 7.
	// Check if document is locked

	if (foundDocument.is_locked) {
		return await res.status(423).json({ message: 'Calendar is locked.' });
	}

	// 8.
	// Check for uniqueness

	try {
		// The values that need to be unique are ['code', 'numeric_code'].
		const foundDocumentWithCalendarCode = await CalendarModel.exists({ code: { $eq: req.body.code } });
		if (foundDocumentWithCalendarCode && foundDocumentWithCalendarCode._id != req.query._id) {
			throw new Error('A Calendar with the same "code" already exists.');
		}
		const foundDocumentWithCalendarNumericCode = await CalendarModel.exists({ numeric_code: { $eq: req.body.numeric_code } });
		if (foundDocumentWithCalendarNumericCode && foundDocumentWithCalendarNumericCode._id != req.query._id) {
			throw new Error('A Calendar with the same "numeric_code" already exists.');
		}
	} catch (error) {
		console.log(error);
		return await res.status(409).json({ message: error.message });
	}

	// 9.
	// Update the requested document

	try {
		const editedDocument = await CalendarModel.replaceOne({ _id: { $eq: req.query._id } }, req.body, { new: true });
		if (!editedDocument) return await res.status(404).json({ message: `Calendar with _id "${req.query._id}" not found.` });
		return await res.status(200).json(editedDocument);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot update this Calendar.' });
	}

	//
}