/* * */

import getSession from '@/authentication/getSession';
import { StopModel } from '@/schemas/Stop/model';
import { StopPropertyHasShelter } from '@/schemas/Stop/options';
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

	// 4.
	// Ensure latest schema modifications are applied in the database.

	try {
		await StopModel.syncIndexes();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot sync indexes.' });
	}

	// 5.
	// Import shelters

	try {
		//

		//
		// Read shelters from CSV

		// const sheltersRaw = fs.readFileSync('/Users/joao/Developer/carrismetropolitana/go/nextjs/pages/api/configs/imports/stops/shelters.csv', { encoding: 'utf8' });
		const sheltersRaw = fs.readFileSync('/app/pages/api/configs/imports/stops/shelters.csv', { encoding: 'utf8' });
		const parsedAllShelters = Papa.parse(sheltersRaw, { delimiter: ',', header: true });

		//
		// Iterate through each available line

		for (const shelterRaw of parsedAllShelters.data) {
			//

			if (!shelterRaw.stop_id) continue;

			let stopId = shelterRaw.stop_id;
			if (stopId.length < 6) stopId = stopId.padStart(6, '0');

			if (shelterRaw.shelter_code) {
				await StopModel.updateOne(
					{ code: stopId },
					{
						$set: {
							has_shelter: StopPropertyHasShelter.Yes,
							shelter_code: shelterRaw.shelter_code,
							shelter_maintainer: 'JC Decaux',
						},
					},
				);
				console.log(`⤷ Updated Stop ${stopId} with Shelter Code ${shelterRaw.shelter_code}`);
				continue;
			};

			//

			await StopModel.updateOne(
				{ code: stopId },
				{
					$set: {
						has_shelter: StopPropertyHasShelter.Yes,
					},
				},
			);
			console.log(`⤷ Updated Stop ${stopId} without Shelter Code`);

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
