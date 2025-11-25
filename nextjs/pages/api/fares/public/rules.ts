/* * */

import getSession from '@/authentication/getSession';
import faresExportRules from '@/scripts/fares/fares.export.rules';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import Papa from 'papaparse';

/* * */

export const config = { api: { responseLimit: false } };

/* * */

export default async function handler(req, res) {
	try {
		const allFareRulesExportedData = await faresExportRules({});
		await res.send(allFareRulesExportedData);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot export from found documents.' });
	}
}
