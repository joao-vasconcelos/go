/* * */

import { LineModel } from '@/schemas/Line/model';

/* * */

export default async function handler(req, res) {
	//

	//
	// List all documents

	try {
		const allDocuments = await LineModel.find().sort({ code: 1 });
		return await res.status(200).send(allDocuments);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Lines.' });
	}

	//
}
