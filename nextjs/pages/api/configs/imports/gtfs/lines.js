/* * */

import getSession from '@/authentication/getSession';
import { AgencyModel } from '@/schemas/Agency/model';
import { FareModel } from '@/schemas/Fare/model';
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
	// Ensure latest schema modifications are applied in the database.

	try {
		await LineModel.syncIndexes();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot sync indexes.' });
	}

	// 6.
	// Update lines

	try {
		//

		// 6.1.
		// Retrieve all Lines from API v2
		const allLinesRes = await fetch('https://api.carrismetropolitana.pt/lines');
		const allLinesApi = await allLinesRes.json();

		// 6.2.
		// Iterate through each available line
		for (const lineApi of allLinesApi) {
			//

			// 6.2.0.
			// Skip if this line is not A2
			if (lineApi.id.startsWith('1')) continue;
			if (lineApi.id.startsWith('2')) continue;
			//   if (lineApi.id.startsWith('3')) continue;
			if (lineApi.id.startsWith('4')) continue;

			// 6.2.1.
			// Skip if line is locked
			const lineGo = await LineModel.findOne({ code: lineApi.id });
			if (lineGo?.is_locked) continue;

			// 6.2.1.
			// Find out to which Agency this line belongs to
			const agencyCode = `4${lineApi.id.substring(0, 1)}`;
			const agencyDocument = await AgencyModel.findOne({ code: agencyCode });

			// 6.2.2.
			// Find out the Typology for this line
			const typologyDocument = await TypologyModel.findOne({ color: lineApi.color });

			// 6.2.3.
			// Find out the Fare for this line
			let fareCode;
			if (typologyDocument?.code === 'PROXIMA') fareCode = 'BORDO-1';
			else if (typologyDocument?.code === 'LONGA') fareCode = 'BORDO-2';
			else if (typologyDocument?.code === 'RAPIDA') fareCode = 'BORDO-3';
			else if (typologyDocument?.code === 'MAR') fareCode = 'BORDO-5';
			else if (typologyDocument?.code === 'INTER-REG' && agencyCode === '42') fareCode = 'BORDO-4-A';
			else if (typologyDocument?.code === 'INTER-REG' && agencyCode === '44') fareCode = 'BORDO-4-B';
			const fareDocument = await FareModel.findOne({ code: fareCode });

			// 6.2.4.
			// Format line to match GO schema
			const parsedLine = {
				agency: agencyDocument?._id || null,
				circular: false,
				code: lineApi.id,
				continuous: false,
				fare: fareDocument?._id || null,
				name: lineApi.long_name,
				routes: [],
				school: false,
				short_name: lineApi.short_name,
				transport_type: 3,
				typology: typologyDocument?._id || null,
			};

			// 6.2.5.
			// Update the line
			const lineDocument = await LineModel.findOneAndUpdate({ code: parsedLine.code }, parsedLine, { new: true, upsert: true });

			// 6.2.6.
			// Log progress
			console.log(`⤷ Updated Line ${lineDocument?.code} (agency: ${agencyDocument?.code}) (typology: ${typologyDocument?.code}) (fare: ${fareDocument?.code})`);

			//
		}

		//
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Import Error' });
	}

	// 7.
	// Log progress
	console.log('⤷ Done. Sending response to client...');
	return await res.status(200).json('Import complete.');
}
