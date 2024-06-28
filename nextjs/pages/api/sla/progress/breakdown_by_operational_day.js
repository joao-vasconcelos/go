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
		const breakdownByDay = await SLAMANAGERDB.TripAnalysis.aggregate([
			{
				$group: {
					_id: '$operational_day',
					error: { $sum: { $cond: [{ $eq: ['$status', 'error'] }, 1, 0] } },
					pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
					processed: { $sum: { $cond: [{ $eq: ['$status', 'processed'] }, 1, 0] } },
					processing: { $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] } },
					total: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					error: 1,
					error_percentage: { $round: [{ $multiply: [{ $divide: ['$error', '$total'] }, 100] }, 2] },
					operational_day: '$_id',
					pending: 1,
					pending_percentage: { $round: [{ $multiply: [{ $divide: ['$pending', '$total'] }, 100] }, 2] },
					processed: 1,
					processed_percentage: { $round: [{ $multiply: [{ $divide: ['$processed', '$total'] }, 100] }, 2] },
					processing: 1,
					processing_percentage: { $round: [{ $multiply: [{ $divide: ['$processing', '$total'] }, 100] }, 2] },
					total: 1,
				},
			},
		]).toArray();

		return await res.send(breakdownByDay);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
