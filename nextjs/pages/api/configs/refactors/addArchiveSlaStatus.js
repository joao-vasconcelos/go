/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { ArchiveModel } from '@/schemas/Archive/model';
import { DateTime } from 'luxon';

/* * */

export default async function handler(req, res) {
	//

	// throw new Error('Feature is disabled.');

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
		await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// Connect to mongodb

	try {
		//

		const allArchivesData = await ArchiveModel.find();

		for (const archiveData of allArchivesData) {
			archiveData.start_date = DateTime.fromJSDate(new Date(archiveData.start_date)).toFormat('yyyyMMdd');
			archiveData.end_date = DateTime.fromJSDate(new Date(archiveData.end_date)).toFormat('yyyyMMdd');
			archiveData.slamanager_feeder_status = 'processed';
			await archiveData.save();
		}

		//
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Import Error' });
	}

	console.log('Done. Sending response to client...');
	return await res.status(200).json('Import complete.');

	//
}