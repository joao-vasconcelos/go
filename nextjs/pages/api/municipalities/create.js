/* * */

import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import { MunicipalityDefault } from '@/schemas/Municipality/default';
import { MunicipalityModel } from '@/schemas/Municipality/model';
import mongodb from '@/services/OFFERMANAGERDB';
import generator from '@/services/generator';

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
		isAllowed(sessionData, [{ action: 'create', scope: 'municipalities' }]);
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
	// Save a new document with default values

	try {
		const newDocument = { ...MunicipalityDefault, code: generator({ length: 4 }) };
		while (await MunicipalityModel.exists({ code: newDocument.code })) {
			newDocument.code = generator({ length: 4 });
		}
		const createdDocument = await MunicipalityModel(newDocument).save();
		return await res.status(201).json(createdDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create this Municipality.' });
	}

	//
}
