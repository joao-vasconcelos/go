import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import * as fs from 'fs';
import { Model as ExportModel } from '@/schemas/Export/model';

/* * */
/* LIST ALL EXPORTS */
/* This endpoint returns all exports. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'export', permission: 'view', req, res });
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
  // List all documents, send them back to the client,
  // and do housekeeping on the tmp directory to ensure only
  // valid files are saved and available in the server.

  try {
    //
    // 3.1.
    // List all Export documents
    const allDocuments = await ExportModel.find();

    // 3.2.
    // Send them to the client immediately
    await res.status(200).send(allDocuments);

    // 3.3.
    // Set the workdir path
    const workdir = `${process.env.PWD}/exports/`;

    // 3.4.
    // Only continue if workdir exists.
    // If no export was ever initiated, then it might not exist yet.
    if (!fs.existsSync(workdir)) return;

    // 3.5.
    // Read the workdir directory contents,
    // filter to keep only folders and map the names.
    const savedExportFiles = fs.readdirSync(workdir, { withFileTypes: true });

    // 3.6.
    // Filter Export documents to keep only the ones that are not errors
    const liveExportDocuments = allDocuments.filter((item) => item.status === 0 || item.status === 1 || item.status === 2).map((item) => String(item._id));

    // 3.7.
    // Compare the documents with the files
    // and remove the dangling files from the directory.
    for (const savedExport of savedExportFiles) {
      // Skip if the object matches a document in the database
      if (liveExportDocuments.includes(savedExport.name)) continue;
      // Remove the object otherwise
      fs.rmSync(`${savedExport.path}/${savedExport.name}`, { recursive: true, force: true });
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Exports.' });
  }
}
