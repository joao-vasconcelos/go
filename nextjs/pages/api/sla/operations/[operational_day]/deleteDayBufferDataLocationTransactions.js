/* * */

import getSession from '@/authentication/getSession';
import SLAMANAGERBUFFERDB from '@/services/SLAMANAGERBUFFERDB';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

/* * */

export const config = {
	maxDuration: 3600,
};

/* * */

export default async function handler(req, res) {
	//

	// throw new Error('Feature is disabled.');

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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'admin', scope: 'configs' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// Connect to mongodb

	try {
		//

		await SLAMANAGERBUFFERDB.connect();

		await SLAMANAGERBUFFERDB.BufferData.deleteMany({ operational_day: { $eq: req.query.operational_day }, type: 'location_transaction' });

		await SLAMANAGERBUFFERDB.OperationalDayStatus.updateOne({ operational_day: { $eq: req.query.operational_day } }, { $set: { location_transaction_synced: false } });

		//
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Error updating documents.' });
	}

	console.log('Done. Sending response to client...');
	return await res.status(200).json('Documents deleted.');

	//
}
