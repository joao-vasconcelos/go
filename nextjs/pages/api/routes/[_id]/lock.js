/* * */

import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import { LineModel } from '@/schemas/Line/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { RouteModel } from '@/schemas/Route/model';
import mongodb from '@/services/OFFERMANAGERDB';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;
	let routeDocument;

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
		isAllowed(sessionData, [{ action: 'lock', scope: 'lines' }]);
	}
	catch (error) {
		console.log(error);
		return await res.status(401).json({ message: error.message || 'Could not verify Authentication.' });
	}

	// 4.
	// Connect to MongoDB

	try {
		await mongodb.connect();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'MongoDB connection error.' });
	}

	// 5.
	// Retrieve the requested document

	try {
		routeDocument = await RouteModel.findOne({ _id: { $eq: req.query._id } });
		if (!routeDocument) return await res.status(404).json({ message: `Route with _id "${req.query._id}" not found.` });
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Route not found.' });
	}

	// 6.
	// Check if parent line is locked

	try {
		const lineDocument = await LineModel.findOne({ _id: { $eq: routeDocument.parent_line } });
		if (!lineDocument) return await res.status(404).json({ message: `Parent Line with _id: ${routeDocument.parent_line} not found.` });
		if (lineDocument.is_locked) return await res.status(423).json({ message: 'Parent Line is locked.' });
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Error retrieving parent Line for this Route.' });
	}

	// 7.
	// Lock or unlock the requested document, as well as the associated child documents

	try {
		routeDocument.is_locked = !routeDocument.is_locked;
		for (const patternId of routeDocument.patterns) {
			await PatternModel.updateOne({ _id: patternId }, { is_locked: routeDocument.is_locked });
		}
		await routeDocument.save();
		return await res.status(200).json(routeDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot update this Route or its associated Patterns.' });
	}

	//
}
