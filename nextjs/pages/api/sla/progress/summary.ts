/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { rides } from '@tmlmobilidade/core/interfaces';

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

	// 5.
	// Perform database search

	try {
		const totalDocuments = await rides.count({});
		const totalDocumentsComplete = await rides.count({ system_status: 'complete' });
		const totalDocumentsProcessing = await rides.count({ system_status: 'processing' });
		const totalDocumentsError = await rides.count({ system_status: 'error' });
		const totalDocumentsPending = await rides.count({ system_status: 'pending' });

		return await res.send({
			//
			complete: totalDocumentsComplete,
			complete_percentage: parseFloat(((totalDocumentsComplete / totalDocuments) * 100).toFixed(2)),
			//
			error: totalDocumentsError,
			error_percentage: parseFloat(((totalDocumentsError / totalDocuments) * 100).toFixed(2)),
			//
			pending: totalDocumentsPending,
			pending_percentage: parseFloat(((totalDocumentsPending / totalDocuments) * 100).toFixed(2)),
			//
			processing: totalDocumentsProcessing,
			processing_percentage: parseFloat(((totalDocumentsProcessing / totalDocuments) * 100).toFixed(2)),
			//
			total: totalDocuments,
			total_percentage: 100,
		});
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
