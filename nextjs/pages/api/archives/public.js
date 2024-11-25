/* * */

import { ArchiveModel } from '@/schemas/Archive/model';

/* * */

export default async function handler(req, res) {
	//

	// 4.
	// Ensure latest schema modifications are applied in the database

	try {
		await ArchiveModel.syncIndexes();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot sync indexes.' });
	}

	// 5.
	// List all documents

	try {
		const allDocuments = await ArchiveModel.find();// .sort({ agency: 1, start_date: -1 }); //.find({ agency: { $in: [...sessionData.user.permissions.archives.view.fields.agency, null, undefined] } });
		return await res.status(200).send(allDocuments);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Archives.' });
	}

	//
}
