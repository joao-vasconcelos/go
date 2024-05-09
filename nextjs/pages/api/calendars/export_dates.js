/* * */

import Papa from 'papaparse';
import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { DateModel } from '@/schemas/Date/model';
import calculateDateDayType from '@/services/calculateDateDayType';

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
	// List all documents

	try {
		foundDocuments = await DateModel.find();
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
		foundDocuments = foundDocuments.sort((a, b) => collator.compare(a.date, b.date));
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Dates.' });
	}

	// 5.
	// Prepare the fields that are to be exported

	try {
		foundDocuments = foundDocuments.map((document) => ({
			date: document.date,
			period: document.period,
			day_type: calculateDateDayType(document.date, document.is_holiday),
			holiday: document.is_holiday ? '1' : '0',
			description: '',
		}));
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Dates.' });
	}

	// 6.
	// Read the previously zipped archive from the filesystem and pipe it to the response.

	try {
		const parsedCsvData = Papa.unparse(foundDocuments, { skipEmptyLines: 'greedy', newline: '\n', header: true });
		await res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename=stops.txt` }).send(parsedCsvData);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create CSV from found documents.' });
	}

	//
}