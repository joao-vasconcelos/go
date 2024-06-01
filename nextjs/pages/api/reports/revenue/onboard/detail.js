/* * */

import getSession from '@/authentication/getSession';
import CSVWRITER from '@/services/CSVWRITER';
import PCGIDB from '@/services/PCGIDB';
import STORAGE from '@/services/STORAGE';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import fs from 'fs';
import { DateTime } from 'luxon';

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
		await prepareApiEndpoint({ method: 'POST', permissions: [{ action: 'download', fields: [{ key: 'kind', values: ['revenue'] }], scope: 'reports' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Parse request body into JSON

	try {
		req.body = await JSON.parse(req.body);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'JSON parse error.' });
	}

	// 5.
	// Prepare datetime variables

	let startDateFormatted;
	let endDateFormatted;

	try {
		startDateFormatted = DateTime.fromFormat(req.body.start_date, 'yyyyMMdd').startOf('day').set({ hour: 4, minute: 0, second: 0 }).toFormat('yyyy-MM-dd\'T\'HH:mm:ss');
		endDateFormatted = DateTime.fromFormat(req.body.end_date, 'yyyyMMdd').plus({ days: 1 }).startOf('day').set({ hour: 3, minute: 59, second: 59 }).toFormat('yyyy-MM-dd\'T\'HH:mm:ss');
	}
	catch (error) {
		console.log('Error parsing dates:', error);
		return await res.status(500).json({ message: 'Error formatting date boundaries.' });
	}

	// 6.
	// Connect to PCGIDB

	try {
		await PCGIDB.connect();
	}
	catch (error) {
		console.log('Error connecting to PCGIDB:', error);
		return await res.status(500).json({ message: 'Could not connect to PCGIDB.' });
	}

	// 7.
	// Setup workdir and CSV writer

	let workdir;
	let csvWriter;

	try {
		workdir = STORAGE.setupWorkdir('reports');
		csvWriter = new CSVWRITER('reports_sales_onboard_detail');
	}
	catch (error) {
		console.log('Error setting up workdir and csvWriter:', error);
	}

	// 8.
	// Perform database search

	try {
		// Setup database query stream
		const queryStream = PCGIDB.SalesEntity.find(
			{
				'transaction.operatorLongID': { $eq: req.body.agency_code },
				'transaction.productLongID': { $regex: /^id-prod-tar/ },
				'transaction.transactionDate': { $gte: startDateFormatted, $lte: endDateFormatted },
			},
			{ allowDiskUse: true, maxTimeMS: 999000 },
		).stream();
		// Fetch and write data to CSV file
		for await (const doc of queryStream) {
			await csvWriter.write(workdir, 'report.csv', {
				_id: doc._id,
				operatorLongID: doc.transaction?.operatorLongID || 'N/A',
				price: doc.transaction?.price || 'N/A',
				productLongID: doc.transaction?.productLongID || 'N/A',
				transactionDate: doc.transaction?.transactionDate || 'N/A',
				transactionId: doc.transaction?.transactionId || 'N/A',
				type: 'onboard',
			});
		}
	}
	catch (error) {
		console.log('Error searching database:', error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	// 9.
	// Send response to client

	try {
		await csvWriter.flush();
		await res.writeHead(200, { 'Content-Disposition': `attachment; filename=report.csv`, 'Content-Type': 'application/zip' });
		fs.createReadStream(`${workdir}/report.csv`).pipe(res);
	}
	catch (error) {
		console.log('Error sending response to client:', error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
