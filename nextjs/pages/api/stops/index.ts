/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { stops } from '@tmlmobilidade/core/interfaces';

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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'view', scope: 'stops' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// List all documents

	try {
		const stopsCollection = await stops.getCollection();
		const allStopsData = await stopsCollection.find({}).toArray();
		const allStopsDataSimplified = allStopsData.map(stop => ({ _id: stop._id, latitude: stop.latitude, longitude: stop.longitude, name: stop.name }));
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
		const sortedDocuments = allStopsDataSimplified.sort((a, b) => collator.compare(a._id, b._id));
		return await res.status(200).send(sortedDocuments);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Stops.' });
	}

	//
}
