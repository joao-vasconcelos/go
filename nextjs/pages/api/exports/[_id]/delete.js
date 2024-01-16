/* * */

import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { ExportModel } from '@/schemas/Export/model';

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
  // Delete the database entry

  try {
    const deletedExport = await ExportModel.findOneAndDelete({ _id: req.query._id });
    if (!deletedExport) return await res.status(404).json({ message: 'Could not find requested Export.' });
    else return await res.status(200).json(deletedExport);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not delete this Export.' });
  }

  //
}
