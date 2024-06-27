/* * */

import getSession from '@/authentication/getSession';
import SLAMANAGERDB from '@/services/SLAMANAGERDB';
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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'view', fields: [{ key: 'kind', values: ['sla'] }], scope: 'reports' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Connect to SLAMANAGERDB

	try {
		await SLAMANAGERDB.connect();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Could not connect to SLAMANAGERDB.' });
	}

	// 5.
	// Perform database search

	try {
		const totalDocuments = await SLAMANAGERDB.TripAnalysis.countDocuments({});
		const totalDocumentsProcessed = await SLAMANAGERDB.TripAnalysis.countDocuments({ status: 'processed' });
		const totalDocumentsProcessing = await SLAMANAGERDB.TripAnalysis.countDocuments({ status: 'processing' });
		const totalDocumentsError = await SLAMANAGERDB.TripAnalysis.countDocuments({ status: 'error' });
		const totalDocumentsPending = await SLAMANAGERDB.TripAnalysis.countDocuments({ status: 'pending' });

		return await res.send({
			//
			error: totalDocumentsError,
			error_percentage: parseFloat(((totalDocumentsError / totalDocuments) * 100).toFixed(2)),
			//
			pending: totalDocumentsPending,
			pending_percentage: parseFloat(((totalDocumentsPending / totalDocuments) * 100).toFixed(2)),
			//
			processed: totalDocumentsProcessed,
			processed_percentage: parseFloat(((totalDocumentsProcessed / totalDocuments) * 100).toFixed(2)),
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
