/* * */

import { DeletedStopModel } from '@/schemas/Stop/model';

/* * */

export default async function handler(req, res) {
	//

	try {
		const allDocuments = await DeletedStopModel.find({});
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
		const sortedDocuments = allDocuments.sort((a, b) => collator.compare(a.code, b.code));
		return await res.status(200).send(sortedDocuments);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Stops.' });
	}

	//
}
