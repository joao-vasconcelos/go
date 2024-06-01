/* * */

import getSession from '@/authentication/getSession';
import { ExportModel } from '@/schemas/Export/model';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

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
		await prepareApiEndpoint({ method: 'DELETE', permissions: [{ action: 'delete', scope: 'exports' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Delete the database entry

	try {
		const deletedExport = await ExportModel.findOneAndDelete({ _id: req.query._id });
		if (!deletedExport) return await res.status(404).json({ message: 'Could not find requested Export.' });
		else return await res.status(200).json(deletedExport);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Could not delete this Export.' });
	}

	//
}
