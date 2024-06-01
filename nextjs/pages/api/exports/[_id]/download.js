/* * */

import getSession from '@/authentication/getSession';
import { ExportModel } from '@/schemas/Export/model';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import fs from 'fs';

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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'download', scope: 'exports' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 3.
	// Download the requested file

	try {
		//
		// 3.1.
		// Retrieve the requested Export from the database.
		// If the Export is not found send an error back to the client.
		const exportSummary = await ExportModel.findOne({ _id: req.query._id });
		if (!exportSummary) return await res.status(404).json({ message: 'Could not find requested Export.' });

		// 3.2.
		// Abort the download operation if the status of the export is not 2 = Completed.
		if (exportSummary.status < 2) return await res.status(409).json({ message: 'Export is not ready yet. Please wait a few moments.' });
		else if (exportSummary.status > 2) return await res.status(500).json({ message: 'Export operation resulted in an error. No file available.' });

		// 3.3.
		// Read the previously zipped archive from the filesystem and pipe it to the response.
		await res.writeHead(200, { 'Content-Disposition': `attachment; filename=${exportSummary.filename}`, 'Content-Type': 'application/zip' });
		fs.createReadStream(`${exportSummary.workdir}/${exportSummary._id}.zip`).pipe(res);

		//
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Could not download this Export.' });
	}

	//
}
