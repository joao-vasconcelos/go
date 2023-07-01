import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import * as fs from 'fs';
import delay from '@/services/delay';
import mongodb from '@/services/mongodb';
import { Model as ExportModel } from '@/schemas/Export/model';

/* * */
/* DOWNLOAD COMPLETED EXPORT */
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
    //
    // 1.1.
    // Fetch latest session data from the database
    const session = await getServerSession(req, res, authOptions);

    // 1.2.
    // Check if user is logged in. Cancel the request if not.
    if (!session) {
      return res.status(401).json({ message: 'You must be logged in to access this feature.' });
    }

    // 1.3.
    // Check if the current user has permission to access this feature
    if (!session?.user?.permissions?.export?.gtfs_v18) {
      return res.status(401).json({ message: 'You do not have permission to access this feature.' });
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not verify Authentication.' });
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
    // Retrieve the requested Export from the database.
    // If the Export is not found send an error back to the client.
    const exportSummary = await ExportModel.findOne({ _id: req.query._id });
    if (!exportSummary) return await res.status(404).json({ message: 'Could not find requested Export.' });

    // 3.2.
    // Abort the download operation if the status of the export is not 2 = Completed.
    if (exportSummary.status < 2) return await res.status(409).json({ message: 'Export is not ready yet. Please wait a few moments.' });
    else if (exportSummary.status > 2) return await res.status(500).json({ message: 'Export operation resulted in an error. No file available.' });

    // 3.3.
    // Read the previously zipped archive from the filesystem and pipe it to the response.
    await res.writeHead(200, { 'Content-Type': 'application/zip', 'Content-Disposition': `attachment; filename=${exportSummary.filename}` });
    fs.createReadStream(`${exportSummary.workdir}/${exportSummary._id}.zip`).pipe(res);

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not download this Export.' });
  }

  //
}
