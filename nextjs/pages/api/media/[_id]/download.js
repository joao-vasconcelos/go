/* * */

import fs from 'fs';
import STORAGE from '@/services/STORAGE';
import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { MediaModel } from '@/schemas/Media/model';

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
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'media', action: 'download' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
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

    // 3.3.
    // Read the previously zipped archive from the filesystem and pipe it to the response.
    await res.writeHead(200, { 'Content-Type': foundDocument.file_mime_type, 'Content-Disposition': `attachment; filename=${foundDocument.title}${foundDocument.file_extension}` });
    fs.createReadStream(STORAGE.getFilePath(foundDocument.storage_scope, `${foundDocument._id}${foundDocument.file_extension}`)).pipe(res);

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not download this Media.' });
  }

  //
}
