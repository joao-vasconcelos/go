/* * */

import getSession from '@/authentication/getSession';
import { LineModel } from '@/schemas/Line/model';
import { RouteDefault } from '@/schemas/Route/default';
import { RouteModel } from '@/schemas/Route/model';
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
		await prepareApiEndpoint({ method: 'POST', permissions: [{ action: 'edit', scope: 'lines' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
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
	// Save a new document with req.body

	try {
		// Get parent Line document
		const parentLineDocument = await LineModel.findOne({ _id: { $eq: req.body.parent_line } });
		// Set an available code for the new Route
		let newRouteCode = `${parentLineDocument.code}_${generator({ length: 2, type: 'numeric' })}`;
		while (await RouteModel.exists({ code: newRouteCode })) {
			newRouteCode = `${parentLineDocument.code}_${generator({ length: 2, type: 'numeric' })}`;
		}
		// Create the new Route document
		const newRoute = { ...RouteDefault, code: newRouteCode, parent_line: req.body.parent_line };
		const createdDocument = await RouteModel(newRoute).save();
		return await res.status(201).json(createdDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create this Route.' });
	}

	//
}
