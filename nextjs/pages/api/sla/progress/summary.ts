/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { rides } from '@tmlmobilidade/interfaces';
import { ProcessingStatus } from '@tmlmobilidade/types';
import { Dates } from '@tmlmobilidade/utils';

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
		//

		const todayOperationalDate = Dates
			.now('Europe/Lisbon')
			.operational_date;

		const startOperationalDate = Dates
			.now('Europe/Lisbon')
			.minus({ months: 2 })
			.startOf('month')
			.operational_date;

		console.log('Fetching summary of SLA progress...');

		const [
			totalDocuments,
			totalDocumentsComplete,
			totalDocumentsProcessing,
			totalDocumentsError,
			totalDocumentsWaiting,
		] = await Promise.all([
			rides.count({ operational_date: { $gte: startOperationalDate, $lte: todayOperationalDate } }),
			rides.count({ operational_date: { $gte: startOperationalDate, $lte: todayOperationalDate }, system_status: ProcessingStatus.Complete }),
			rides.count({ operational_date: { $gte: startOperationalDate, $lte: todayOperationalDate }, system_status: ProcessingStatus.Processing }),
			rides.count({ operational_date: { $gte: startOperationalDate, $lte: todayOperationalDate }, system_status: ProcessingStatus.Error }),
			rides.count({ operational_date: { $gte: startOperationalDate, $lte: todayOperationalDate }, system_status: ProcessingStatus.Waiting }),
		]);
		console.log('SLA progress summary fetched successfully.');
		return await res.send({
			//
			complete: totalDocumentsComplete,
			complete_percentage: parseFloat(((totalDocumentsComplete / totalDocuments) * 100).toFixed(2)),
			//
			error: totalDocumentsError,
			error_percentage: parseFloat(((totalDocumentsError / totalDocuments) * 100).toFixed(2)),
			//
			waiting: totalDocumentsWaiting,
			waiting_percentage: parseFloat(((totalDocumentsWaiting / totalDocuments) * 100).toFixed(2)),
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
