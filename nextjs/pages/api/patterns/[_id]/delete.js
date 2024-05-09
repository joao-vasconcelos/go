/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { PatternModel } from '@/schemas/Pattern/model';
import { RouteModel } from '@/schemas/Route/model';

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
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ request: req, method: 'DELETE', session: sessionData, permissions: [{ scope: 'lines', action: 'delete' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Delete the requested document

	try {
		//
		// Because Pattern is related with Route,
		// when Pattern is deleted it should trigger an update in Route.

		const documentToDelete = await PatternModel.findOne({ _id: { $eq: req.query._id } });

		const deletedDocument = await PatternModel.findOneAndDelete({ _id: { $eq: req.query._id } });
		if (!deletedDocument) return await res.status(404).json({ message: `Pattern with _id "${req.query._id}" not found.` });

		const parentDocument = await RouteModel.findOne({ _id: documentToDelete.parent_route });
		if (!parentDocument) return await res.status(404).json({ message: `Route with _id: ${documentToDelete.parent_route} not found.` });

		let validPatternIds = [];
		for (const pattern_id of parentDocument.patterns) {
			const foundDocumentWithPatternId = await PatternModel.exists({ _id: pattern_id });
			if (foundDocumentWithPatternId) validPatternIds.push(pattern_id);
		}
		parentDocument.patterns = validPatternIds;

		const editedParentDocument = await RouteModel.findOneAndUpdate({ _id: parentDocument._id }, parentDocument, { new: true });
		if (!editedParentDocument) return await res.status(404).json({ message: `Route with _id: ${parentDocument._id} not found.` });

		return await res.status(200).send(deletedDocument);

		//
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot delete this Pattern.' });
	}

	//
}