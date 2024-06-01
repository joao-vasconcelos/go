/* * */

import getSession from '@/authentication/getSession';
import { DateModel } from '@/schemas/Date/model';
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
		await prepareApiEndpoint({ method: 'POST', permissions: [{ action: 'edit_dates', scope: 'calendars' }], request: req, session: sessionData });
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
	// Save new documents from req.body

	try {
		let createdDocuments = [];
		for (const dateObject of req.body) {
			const createdDocument = await DateModel.findOneAndUpdate({ date: dateObject.date }, dateObject, { new: true, upsert: true });
			createdDocuments.push(createdDocument);
		}
		return await res.status(201).json(createdDocuments);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create this Date.' });
	}

	//
}
