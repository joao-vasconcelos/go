/* * */

import getSession from '@/authentication/getSession';
import reportsSlaExportDefault from '@/scripts/reports/sla/reports.sla.export.default';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import fs from 'fs';
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
		const exportedFilePath = await reportsSlaExportDefault();
		await res.writeHead(200, { 'Content-Disposition': `attachment; filename=SLA-Default.csv`, 'Content-Type': 'text/csv' });
		fs.createReadStream(exportedFilePath).pipe(res);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot create CSV from found documents.' });
	}

	//
}
