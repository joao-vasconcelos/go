/* * */

import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import { PatternModel } from '@/schemas/Pattern/model';
import { RouteModel } from '@/schemas/Route/model';
import mongodb from '@/services/OFFERMANAGERDB';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;
	let patternDocument;

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
		patternDocument = await PatternModel.findOne({ _id: { $eq: req.query._id } });
		if (!patternDocument) return await res.status(404).json({ message: `Pattern with _id "${req.query._id}" not found.` });
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Pattern not found.' });
	}

	// 6.
	// Check if parent route is locked

	try {
		const routeDocument = await RouteModel.findOne({ _id: { $eq: patternDocument.parent_route } });
		if (!routeDocument) return await res.status(404).json({ message: `Route with _id: ${patternDocument.parent_route} not found.` });
		if (routeDocument.is_locked) return await res.status(423).json({ message: 'Parent Route is locked.' });
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Error retrieving parent Route for this Pattern.' });
	}

	// 7.
	// Lock or unlock the requested document

	try {
		patternDocument.is_locked = !patternDocument.is_locked;
		await patternDocument.save();
		return await res.status(200).json(patternDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot update this Pattern.' });
	}

	//
}
