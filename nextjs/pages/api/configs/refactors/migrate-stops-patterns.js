/* * */

import getSession from '@/authentication/getSession';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
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
		const allPatternCodes = await PatternModel.find({}, 'code');

		// For each pattern
		for (const patternCode of allPatternCodes) {
			//

			// Fetch pattern data from database
			const patternData = await PatternModel.findOne({ code: patternCode.code }).populate('path.stop');

			console.log(`Preparing pattern ${patternData.code} ...`);

			for (const pathItem of patternData.path) {
				// Migrate stop reference
				pathItem.stop_id = pathItem.stop.code;
			}

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
