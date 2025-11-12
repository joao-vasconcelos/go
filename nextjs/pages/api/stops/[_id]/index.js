/* * */

import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import { stops } from '@tmlmobilidade/interfaces';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;

	// 2.
	// Refuse request if not GET

	if (req.method != 'GET') {
		await res.setHeader('Allow', ['GET']);
		return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
	}

	// 3.
	// Check for correct Authentication and valid Permissions

	try {
		sessionData = await getSession(req, res);
		isAllowed(sessionData, [{ action: 'view', scope: 'stops' }]);
	}
	catch (error) {
		console.log(error);
		return await res.status(401).json({ message: error.message || 'Could not verify Authentication.' });
	}

	// 5.
	// Fetch the requested document

	try {
		const foundDocument = await stops.findById(req.query._id);
		if (!foundDocument) return await res.status(404).json({ message: `Stop with _id "${req.query._id}" not found.` });
		return await res.status(200).json(foundDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot fetch this Stop.' });
	}

	//
}
