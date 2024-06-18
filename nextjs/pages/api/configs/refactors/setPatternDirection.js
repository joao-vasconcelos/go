/* * */

import getSession from '@/authentication/getSession';
import { PatternModel } from '@/schemas/Pattern/model';
import { RouteModel } from '@/schemas/Route/model';
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

		const allPatternsIds = await PatternModel.find({}, '_id code direction parent_route').populate('parent_route');

		for (const patternId of allPatternsIds) {
			//
			console.log(`Preparing pattern ${patternId.code} ...`);

			if (!patternId.parent_route) console.log(`MAJOR ERROR: pattern_id: ${patternId.code} pattern_code: ${patternId.code} route_id: ${patternId.parent_route.code}`);

			const thisPatternDirectionIndex = patternId.parent_route.patterns.findIndex(item => String(item._id) === String(patternId._id));

			if (thisPatternDirectionIndex === 0) patternId.direction = '0';
			else if (thisPatternDirectionIndex === 1) patternId.direction = '1';
			else console.log(`UNKOWN DIRECTION INDEX: pattern_id: ${patternId.code} pattern_code: ${patternId.code} route_id: ${patternId.parent_route.code} direction_index: ${thisPatternDirectionIndex}`);

			await patternId.save();

			console.log(`Updated pattern ${patternId.code}`);
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
