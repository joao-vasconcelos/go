/* * */

import fs from 'fs';
import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { ExportModel } from '@/schemas/Export/model';
import STORAGE from '@/services/STORAGE';

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
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'exports', action: 'view' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // List all documents, send them back to the client,
  // and do housekeeping on the tmp directory to ensure only
  // valid files are saved and available in the server.

  try {
    //
    // 4.1.
    // List all Export documents
    const allDocuments = await ExportModel.find();

    // 4.2.
    // Sort documents by creation date DESC
    const sortedDocuments = allDocuments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 4.3.
    // Send them to the client immediately
    await res.status(200).send(sortedDocuments);

    // 4.4.
    // Set the workdir path
    const workdir = STORAGE.getScopeDirPath('exports');

    // 4.5.
    // Only continue if workdir exists.
    // If no export was ever initiated, then it might not exist yet.
    if (!fs.existsSync(workdir)) return;

    // 4.6.
    // Read the workdir directory contents,
    // filter to keep only folders and map the names.
    const savedExportFiles = fs.readdirSync(workdir, { withFileTypes: true });

    // 4.7.
    // Filter Export documents to keep only the ones that are not errors
    const validExportDocumentIds = allDocuments.map((item) => String(item._id)); // .filter((item) => item.status !== 5)

    // 4.8.
    // Compare the existing files with each document
    // and remove the dangling files from the directory.
    for (const savedExport of savedExportFiles) {
      // Skip if the object matches a document in the database
      if (validExportDocumentIds.includes(savedExport.name)) continue;
      // Remove the object otherwise
      fs.rmSync(`${workdir}/${savedExport.name}`, { recursive: true, force: true });
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Exports.' });
  }

  //
}
