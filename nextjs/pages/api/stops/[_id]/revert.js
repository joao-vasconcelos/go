/* * */

import getSession from '@/authentication/getSession';
import { StopDefault } from '@/schemas/Stop/default';
import { DeletedStopModel, StopModel } from '@/schemas/Stop/model';
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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'delete', scope: 'stops' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Retrieve requested document from the database

	try {
		//

		const deletedStopToRevert = await DeletedStopModel.findOne({ code: req.query._id }).lean();

		if (!deletedStopToRevert) return await res.status(404).json({ message: `Deleted Stop with _id "${req.query._id}" not found.` });

		const newStop = { ...StopDefault, ...deletedStopToRevert, code: req.query._id };

		console.log(newStop);

		await StopModel(newStop).save();

		await DeletedStopModel.findOneAndDelete({ code: req.query._id });

		return await res.status(200).send({ message: 'Done' });

		//
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Delete Error' });
	}

	//
}
