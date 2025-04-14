/* * */

import getSession from '@/authentication/getSession';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
import { ZoneModel } from '@/schemas/Zone/model';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

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
		// Fetch all Lines from database
		const allStopsData = await StopModel.find().populate('zones');

		// For each stop
		for (const stopData of allStopsData) {
			//

			console.log(`Preparing stop ${stopData.code} ...`);

			stopData.zones = [...stopData.zones.filter(zone => zone.code !== '1106')];

			console.log('------------------------');

			await stopData.save();

			console.log(`Updated stop ${stopData.code}`);

			//
		}

		// Fetch all Lines from database
		const allPatternsCode = await PatternModel.find({}, 'code');

		// For each pattern
		for (const patternCode of allPatternsCode) {
			//

			const patternData = await PatternModel.findOne({ code: patternCode.code }).populate('path.zones');

			console.log(`Preparing pattern ${patternData.code} ...`);

			patternData.path = patternData.path.map((pathItem) => {
				pathItem.zones = [...pathItem.zones.filter(zone => zone.code !== '1106')];
				return pathItem;
			});

			console.log('------------------------');

			await patternData.save();

			console.log(`Updated pattern ${patternData.code}`);

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
