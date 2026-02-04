/* * */

import { RouteModel } from '@/schemas/Route/model';

/* * */

export default async function handler(req, res) {
	//

	//
	// List all documents

	try {
		const allDocuments = await RouteModel.find({}, '_id code name parent_line');
		return await res.status(200).send(allDocuments);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Routes.' });
	}

	//
}
