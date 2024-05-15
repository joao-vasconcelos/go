/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { StopModel, DeletedStopModel } from '@/schemas/Stop/model';
import { StopDefault } from '@/schemas/Stop/default';

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

		const deletedStopToRevert = await DeletedStopModel.findOne({ code: '162842' }).lean();

		const newStop = { ...StopDefault, ...deletedStopToRevert };

		// console.log(newStop);

		await StopModel(newStop).save();

		await DeletedStopModel.findOneAndDelete({ code: '162842' });

		//
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Delete Error' });
	}

	console.log('Done. Sending response to client...');
	return await res.status(200).json('Delete complete.');

	//
}