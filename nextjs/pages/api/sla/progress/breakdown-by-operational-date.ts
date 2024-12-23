/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { rides } from '@tmlmobilidade/services/interfaces';
import { getOperationalDate } from '@tmlmobilidade/services/utils';
import { DateTime } from 'luxon';

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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'create', fields: [{ key: 'kind', values: ['sla_default_v1'] }], scope: 'exports' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// Perform database search

	try {
		// Get all distinct operational days that have have been fully complete

		const ridesCollection = await rides.getCollection();

		const breakdownByOperationalDateAndStatus = await ridesCollection
			.aggregate([
				{ $group: { _id: { operational_date: '$operational_date', status: '$status' }, count: { $sum: 1 } } },
				{ $sort: { '_id.operational_date': 1, '_id.status': 1 } },
			])
			.toArray();

		const groupedByOperationalDate = {};

		for (const breakdown of breakdownByOperationalDateAndStatus) {
			//
			const operationalDate = breakdown._id.operational_date;
			const status = breakdown._id.status;
			const count = breakdown.count;

			if (!groupedByOperationalDate[operationalDate]) {
				groupedByOperationalDate[operationalDate] = {};
			}

			groupedByOperationalDate[operationalDate][status] = count;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const breakdownByOperationalDateAndStatusParsed: any[] = [];

		for (const operationalDate in groupedByOperationalDate) {
			//
			const breakdown = groupedByOperationalDate[operationalDate];

			const complete = breakdown.complete || 0;
			const error = breakdown.error || 0;
			const pending = breakdown.pending || 0;
			const processing = breakdown.processing || 0;
			const total = complete + error + pending + processing;

			const todayOperationalDate = getOperationalDate(DateTime.now());

			breakdownByOperationalDateAndStatusParsed.push({
				//
				complete,
				complete_percentage: parseFloat(((complete / total) * 100).toFixed(2)),
				//
				error,
				error_percentage: parseFloat(((error / total) * 100).toFixed(2)),
				//
				operational_date: operationalDate === todayOperationalDate ? `${operationalDate} (Today)` : operationalDate,
				//
				pending,
				pending_percentage: parseFloat(((pending / total) * 100).toFixed(2)),
				//
				processing,
				processing_percentage: parseFloat(((processing / total) * 100).toFixed(2)),
				//
				total,
			});
		}

		return await res.send(breakdownByOperationalDateAndStatusParsed);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
