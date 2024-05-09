/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { ArchiveModel } from '@/schemas/Archive/model';

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
		await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'archives', action: 'view' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Ensure latest schema modifications are applied in the database

	try {
		await ArchiveModel.syncIndexes();
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot sync indexes.' });
	}

	// 5.
	// List all documents

	try {
		const allDocuments = await ArchiveModel.find().sort({ agency: 1, start_date: -1 }); //.find({ agency: { $in: [...sessionData.user.permissions.archives.view.fields.agency, null, undefined] } });
		const sortedDocuments = allDocuments.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
		return await res.status(200).send(allDocuments);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Archives.' });
	}

	//
}