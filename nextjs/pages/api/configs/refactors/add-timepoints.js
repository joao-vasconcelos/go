/* * */

import getSession from '@/authentication/getSession';
import { PatternModel } from '@/schemas/Pattern/model';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import Papa from 'papaparse';

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

	const timepointsKeysSet = new Set();

	try {
		const downloadedCsvText = await fetch('https://storage.carrismetropolitana.pt/static/test/timepoints.csv').then(response => response.text());
		const timepointsData = Papa.parse(downloadedCsvText, { header: true });
		for (const row of timepointsData.data) {
			if (!row.timepoint || row.timepoint !== '1') continue;
			timepointsKeysSet.add(`${row.pattern_id}-${row.stop_id}`);
		}
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Import Error' });
	}

	// 5.
	// Connect to mongodb

	try {
		//
		// Fetch all Patterns from database
		const allPatternCodes = await PatternModel.find({}, 'code');

		// For each pattern
		for (const patternCode of allPatternCodes) {
			//

			// Fetch pattern data from database
			const patternData = await PatternModel.findOne({ code: patternCode.code }).populate('path.stop');

			const newPathForThisPattern = [];

			// For each path
			for (const pathData of patternData.path) {
				//

				if (!pathData.stop?.code) continue;

				if (timepointsKeysSet.has(`${patternData.code}-${pathData.stop.code}`)) {
					pathData.timepoint = true;
				}
				else {
					pathData.timepoint = false;
				}

				newPathForThisPattern.push(pathData);

				//
			}

			console.log('------------------------');

			patternData.path = newPathForThisPattern;

			await PatternModel.findOneAndReplace({ _id: patternData._id }, patternData, { new: true });

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
}
