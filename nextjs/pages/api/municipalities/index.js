/* * */

import { MunicipalityModel } from '@/schemas/Municipality/model';

/* * */

export default async function handler(req, res) {
	//

	//
	// List all documents

	try {
		const allDocuments = await MunicipalityModel.find();
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
		const sortedDocuments = allDocuments.sort((a, b) => collator.compare(a.name, b.name));
		return await res.status(200).send(sortedDocuments);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Municipalities.' });
	}

	//
}
