/* * */

import getSession from '@/authentication/getSession';
import { DeletedStopModel } from '@/schemas/Stop/model';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import Papa from 'papaparse';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;
	let foundDocuments;

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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'export', scope: 'stops' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// List all documents

	try {
		foundDocuments = await DeletedStopModel.find();
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
		foundDocuments = foundDocuments.sort((a, b) => collator.compare(a.code, b.code));
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Deleted Stops.' });
	}

	// 5.
	// Prepare the fields that are to be exported

	try {
		foundDocuments = foundDocuments.map(document => ({
			stop_id: document.code,
			stop_lat: document.latitude,
			stop_lon: document.longitude,
			stop_name: document.name,
		}));
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Deleted Stops.' });
	}

	// 6.
	// Read the previously zipped archive from the filesystem and pipe it to the response.

	try {
		const parsedCsvData = Papa.unparse(foundDocuments, { header: true, newline: '\n', skipEmptyLines: 'greedy' });
		await res.writeHead(200, { 'Content-Disposition': `attachment; filename=stops.txt`, 'Content-Type': 'text/csv' }).send(parsedCsvData);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create CSV from found documents.' });
	}

	//
}
