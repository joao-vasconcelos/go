/* * */

import isAllowed from '@/authentication/isAllowed';
import mongodb from '@/services/OFFERMANAGERDB';

/* * */

export default async function prepareApiEndpoint({ method = 'GET', permissions, request, session }) {
	//

	// 1.
	// Refuse request if not desired method

	if (request.method !== method) {
		throw new Error('Request method not allowed.');
	}

	// 2.
	// Check for correct Authentication and valid Permissions

	try {
		isAllowed(session, permissions);
	}
	catch (error) {
		console.log(error);
		throw new Error('Could not verify Authentication.');
	}

	// 3.
	// Connect to MongoDB

	try {
		await mongodb.connect();
	}
	catch (error) {
		console.log(error);
		throw new Error('Could not connect to MongoDB.');
	}

	//
}
