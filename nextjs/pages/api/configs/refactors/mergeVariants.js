/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { PatternModel } from '@/schemas/Pattern/model';

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
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// Connect to mongodb

	try {
		//

		const patternDataBaseWayOne = await PatternModel.findOne({ code: '3011_0_1' });
		const patternDataBaseWayTwo = await PatternModel.findOne({ code: '3011_0_2' });

		const patternDataVariantWayOne = await PatternModel.findOne({ code: '3011_1_1' });
		const patternDataVariantWayTwo = await PatternModel.findOne({ code: '3011_1_2' });

		patternDataVariantWayOne.schedules = [...patternDataVariantWayOne.schedules, ...patternDataBaseWayOne.schedules];
		patternDataVariantWayTwo.schedules = [...patternDataVariantWayTwo.schedules, ...patternDataBaseWayTwo.schedules];

		await patternDataVariantWayOne.save();
		await patternDataVariantWayTwo.save();

		//
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Import Error' });
	}

	console.log('Done. Sending response to client...');
	return await res.status(200).json('Import complete.');

	//
}