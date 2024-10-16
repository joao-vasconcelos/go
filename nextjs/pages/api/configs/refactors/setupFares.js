/* * */

import getSession from '@/authentication/getSession';
import { LineModel } from '@/schemas/Line/model';
import { TypologyModel } from '@/schemas/Typology/model';
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
		// Fetch all Typologies from database
		const allTypologiesData = await TypologyModel.find();

		// Fetch all Lines from database
		const allLinesData = await LineModel.find();

		// For each line
		for (const lineData of allLinesData) {
			//

			console.log(`Preparing line ${lineData.code} ...`);

			const associatedTypologyData = allTypologiesData.find(item => String(item._id) === String(lineData.typology));
			if (!associatedTypologyData) {
				console.log('Error on line', lineData.code, 'typology', lineData.typology, 'not found');
				continue;
			}

			let newPrepaidFare;
			let newOnboardFares = [];

			if (associatedTypologyData.default_prepaid_fare) newPrepaidFare = associatedTypologyData.default_prepaid_fare;

			if (associatedTypologyData.default_onboard_fares) {
				for (const defaultOnboardFare of associatedTypologyData.default_onboard_fares) {
					newOnboardFares.push(defaultOnboardFare);
				}
			}

			lineData.fares = undefined;
			lineData.prepaid_fare = newPrepaidFare;
			lineData.onboard_fares = newOnboardFares;

			console.log('------------------------');

			await lineData.save();

			console.log(`Updated line ${lineData.code}`);

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
