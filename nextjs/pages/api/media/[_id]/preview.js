/* * */

import * as fs from 'fs';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Model as MediaModel } from '@/schemas/Media/model';
import STORAGE from '@/services/STORAGE';
import { Options as MediaOptions } from '@/schemas/Media/options';

/* * */

export default async function handler(req, res) {
  //

  // 0.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'exports', permission: 'view', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 3.
  // Download the requested file

  try {
    //
    // 3.1.
    // Retrieve the requested Media from the database.
    // If the Media is not found send an error back to the client.
    const foundDocument = await MediaModel.findOne({ _id: req.query._id });
    if (!foundDocument) return await res.status(404).json({ message: 'Could not find requested Media.' });

    if (!foundDocument.file_mime_type.includes('image')) return await res.status(400).json({ message: 'Preview cannot be constructed for this Media.' });

    // 3.3.
    // Read the previously zipped archive from the filesystem and pipe it to the response.
    await res.writeHead(200, { 'Content-Type': foundDocument.file_mime_type });
    const fileData = fs.readFileSync(STORAGE.getFilePath(MediaOptions.workdir, `${foundDocument._id}${foundDocument.file_extension}`));
    await res.send(fileData);

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not download this Media.' });
  }

  //
}
