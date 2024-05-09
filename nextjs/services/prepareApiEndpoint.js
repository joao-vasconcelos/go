/* * */

import mongodb from '@/services/OFFERMANAGERDB';
import isAllowed from '@/authentication/isAllowed';

/* * */

export default async function prepareApiEndpoint({ request, method = 'GET', session, permissions }) {
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
	} catch (error) {
		console.log(error);
		throw new Error('Could not verify Authentication.');
	}

	// 3.
	// Connect to MongoDB

	try {
		await mongodb.connect();
	} catch (error) {
		console.log(error);
		throw new Error('Could not connect to MongoDB.');
	}

	//
}