/* * */

import getSession from '@/authentication/getSession';
import municipalitiesExportDefault from '@/scripts/municipalities/municipalities.export.default';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import Papa from 'papaparse';

/* * */

export const config = { api: { responseLimit: false } };

/* * */

export default async function handler(req, res) {
	//

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
	// Get exported data and transform it into CSV

	try {
		const allMunicipalitiesExportedData = await municipalitiesExportDefault();
		const parsedCsvData = Papa.unparse(allMunicipalitiesExportedData, { header: true, newline: '\n', skipEmptyLines: 'greedy' });
		await res.writeHead(200, { 'Content-Disposition': `attachment; filename=municipalities.txt`, 'Content-Type': 'text/csv' }).send(parsedCsvData);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create CSV from found documents.' });
	}

	//
}
