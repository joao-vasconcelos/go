/* * */

import getSession from '@/authentication/getSession';
import sorter from '@/helpers/sorter';
import { PatternModel } from '@/schemas/Pattern/model';
import { RouteModel } from '@/schemas/Route/model';
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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'view', scope: 'lines' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// Fetch the requested document

	try {
		routeDocument = await RouteModel.findOne({ _id: { $eq: req.query._id } });
		if (!routeDocument) return await res.status(404).json({ message: `Route with _id "${req.query._id}" not found.` });
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: `Error fetching Route with _id "${req.query._id}" from the database.` });
	}

	// 6.
	// Synchronize descendant patterns for this route

	try {
		const allDescendantPatternsForThisRoute = await PatternModel.find({ parent_route: { $eq: routeDocument._id } }, '_id code');
		routeDocument.patterns = allDescendantPatternsForThisRoute.sort((a, b) => sorter.compare(a.code, b.code)).map(item => item._id);
		await routeDocument.save();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: `Error synchronizing descendant Patterns for the Route with _id "${routeDocument._id}".` });
	}

	// 7.
	// Return requested document to the caller

	try {
		return await res.status(200).json(routeDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Error sending response to client.' });
	}

	//
}
