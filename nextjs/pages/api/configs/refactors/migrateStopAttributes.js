/* * */

import getSession from '@/authentication/getSession';
import { StopModel } from '@/schemas/Stop/model';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

/* * */

export default async function handler(req, res) {
	//

	throw new Error('Feature is disabled.');

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
		// Fetch all Stops from database
		const allStopsData = await StopModel.find();

		// For each stop
		for (const stopData of allStopsData) {
			//

			switch (stopData.current_status) {
				case '2':
					stopData.operational_status = 'inactive';
					stopData.current_status = undefined;
					break;
				case '3':
					stopData.operational_status = 'provisional';
					stopData.current_status = undefined;
					break;
				case '4':
					stopData.operational_status = 'voided';
					stopData.current_status = undefined;
					break;
				default:
					stopData.operational_status = 'active';
					stopData.current_status = undefined;
					break;
			}

			await stopData.save();

			console.log(`Updated stop ${stopData.code}`);

			//
		}

		//
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Import Error' });
	}

	console.log('Done. Sending response to client...');
	return await res.status(200).json('Import complete.');

	//
}
