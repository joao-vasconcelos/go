/* * */

import getSession from '@/authentication/getSession';
import { LineModel } from '@/schemas/Line/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { RouteModel } from '@/schemas/Route/model';
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
		await prepareApiEndpoint({ method: 'DELETE', permissions: [{ action: 'delete', scope: 'lines' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 3.
	// Delete the requested document

	try {
		const deletedLineDocument = await LineModel.findOneAndDelete({ _id: { $eq: req.query._id } });
		if (!deletedLineDocument) return await res.status(404).json({ message: `Line with _id "${req.query._id}" not found.` });
		// Delete Routes associated with this Line
		const routeDocumentsToDelete = await RouteModel.find({ parent_line: { $eq: req.query._id } });
		for (const routeToDelete of routeDocumentsToDelete) {
			// Delete Patterns associated with the deleted Route
			await PatternModel.deleteMany({ parent_route: { $eq: routeToDelete._id } });
			// Delete Route document
			await RouteModel.findOneAndDelete({ _id: { $eq: routeToDelete._id } });
		}
		return await res.status(200).send(deletedLineDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot delete this Line.' });
	}

	//
}
