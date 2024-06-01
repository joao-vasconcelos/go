/* * */

import getSession from '@/authentication/getSession';
import sorter from '@/helpers/sorter';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;
	let lineDocument;

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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'view', scope: 'lines' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Fetch the requested document

	try {
		lineDocument = await LineModel.findOne({ _id: { $eq: req.query._id } });
		if (!lineDocument) return await res.status(404).json({ message: `Line with _id "${req.query._id}" not found.` });
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: `Error fetching Line with _id "${req.query._id}" from the database.` });
	}

	// 5.
	// Synchronize descendant routes for this line

	try {
		const allDescendantRoutesForThisLine = await RouteModel.find({ parent_line: { $eq: lineDocument._id } }, '_id code');
		lineDocument.routes = allDescendantRoutesForThisLine.sort((a, b) => sorter.compare(a.code, b.code)).map(item => item._id);
		await lineDocument.save();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: `Error synchronizing descendant Routes for the Line with _id "${lineDocument._id}".` });
	}

	// 6.
	// Return requested document to the caller

	try {
		return await res.status(200).json(lineDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Error sending response to client.' });
	}

	//
}
