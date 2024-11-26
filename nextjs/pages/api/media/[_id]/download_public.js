/* * */

import { MediaModel } from '@/schemas/Media/model';
import STORAGE from '@/services/STORAGE';
import fs from 'fs';

/* * */

export default async function handler(req, res) {
	//

	// 3.
	// Download the requested file

	try {
		//
		// 3.1.
		// Retrieve the requested Media from the database.
		// If the Media is not found send an error back to the client.
		const foundDocument = await MediaModel.findOne({ _id: req.query._id });
		if (!foundDocument) return await res.status(404).json({ message: 'Could not find requested Media.' });
		if (foundDocument.storage_scope !== 'archives') return await res.status(400).json({ message: 'This Media is not a public archive.' });

		// 3.3.
		// Read the archive from the filesystem and pipe it to the response.
		await res.writeHead(200, { 'Content-Disposition': `attachment; filename=${foundDocument.title}${foundDocument.file_extension}`, 'Content-Type': foundDocument.file_mime_type });
		fs.createReadStream(STORAGE.getFilePath(foundDocument.storage_scope, `${foundDocument._id}${foundDocument.file_extension}`)).pipe(res);

		//
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Could not download this Media.' });
	}

	//
}
