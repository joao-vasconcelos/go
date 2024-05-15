/* * */

import Papa from 'papaparse';
import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import stopsSyncDatasets from '@/scripts/stops/stops.sync.datasets';
import stopsExportDefault from '@/scripts/stops/stops.export.default';

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
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'stops', action: 'export' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Sync datasets first

	try {
		await stopsSyncDatasets();
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Sync Datasets Error' });
	}

	// 5.
	// Get exported data and transform it into CSV

	try {
		const allStopsExportedData = await stopsExportDefault();
		const parsedCsvData = Papa.unparse(allStopsExportedData, { skipEmptyLines: 'greedy', newline: '\n', header: true });
		await res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename=stops.txt` }).send(parsedCsvData);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create CSV from found documents.' });
	}

	//
}