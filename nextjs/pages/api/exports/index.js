/* * */

import mongodb from '@/services/mongodb';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import fs from 'fs';
import { ExportModel } from '@/schemas/Export/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;

  // 2.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 3.
  // Check for correct Authentication and valid Permissions

  try {
    sessionData = await getSession(req, res);
    isAllowed(sessionData, [{ scope: 'exports', action: 'view' }]);
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 4.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // List all documents, send them back to the client,
  // and do housekeeping on the tmp directory to ensure only
  // valid files are saved and available in the server.

  try {
    //
    // 5.1.
    // List all Export documents
    const allDocuments = await ExportModel.find();

    // 5.2.
    // Sort documents by creation date DESC
    const sortedDocuments = allDocuments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 5.3.
    // Send them to the client immediately
    await res.status(200).send(sortedDocuments);

    // 5.4.
    // Set the workdir path
    const workdir = `${process.env.PWD}/exports/`;

    // 5.5.
    // Only continue if workdir exists.
    // If no export was ever initiated, then it might not exist yet.
    if (!fs.existsSync(workdir)) return;

    // 5.6.
    // Read the workdir directory contents,
    // filter to keep only folders and map the names.
    const savedExportFiles = fs.readdirSync(workdir, { withFileTypes: true });

    // 5.7.
    // Filter Export documents to keep only the ones that are not errors
    const validExportDocumentIds = allDocuments.map((item) => String(item._id)); // .filter((item) => item.status !== 5)

    // 5.8.
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
