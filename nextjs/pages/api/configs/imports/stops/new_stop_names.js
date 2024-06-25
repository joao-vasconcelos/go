/* * */

import getSession from '@/authentication/getSession';
import { StopModel } from '@/schemas/Stop/model';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import fs from 'fs';
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
	// Import New Names

	try {
		//

		const allNewStopNamesRaw = fs.readFileSync('/app/pages/api/configs/imports/stops/new_stop_names.csv', { encoding: 'utf8' });
		// const allNewStopNamesRaw = fs.readFileSync('./pages/api/configs/imports/stops/new_stop_names.csv', { encoding: 'utf8' });

		const allNewStopNamesData = Papa.parse(allNewStopNamesRaw, { delimiter: ',', header: true });

		for (const newStopNameData of allNewStopNamesData.data) {
			//

			await StopModel.updateOne({ code: newStopNameData.code }, { $set: { name_new: newStopNameData.new_name } });

			console.log(`⤷ Imported Stop  ${newStopNameData.code}`);

			//
		}

		//
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Import Error' });
	}

	// 6.
	// Log progress
	console.log('⤷ Done. Sending response to client...');
	return await res.status(200).json('Import complete.');

	//
}
