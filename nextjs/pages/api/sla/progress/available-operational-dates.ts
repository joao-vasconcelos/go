/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { rides } from '@tmlmobilidade/services/interfaces';

/* * */

export default async function handler(req, res) {
	//

	//
	// Setup variables

	let sessionData;

	//
	// Get session data

	try {
		sessionData = await getSession(req, res);
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	//
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'create', fields: [{ key: 'kind', values: ['sla_default_v1'] }], scope: 'exports' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	//
	// Perform database search

	try {
		const ridesCollection = await rides.getCollection();

		const availableOperationalDates = await ridesCollection
			.aggregate([
				{ $match: { status: 'complete' } },
				{ $group: { _id: '$operational_date' } },
				{ $sort: { _id: 1 } },
			])
			.toArray();

		const availableOperationalDatesParsed = availableOperationalDates.map(item => item._id);

		return await res.send(availableOperationalDatesParsed);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
