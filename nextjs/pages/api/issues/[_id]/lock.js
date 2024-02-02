/* * */

import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Model as IssueModel } from '@/schemas/Issue/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'issues', permission: 'lock', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 3.
  // Connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4.
  // Lock or unlock the requested document

  try {
    const foundDocument = await IssueModel.findOne({ _id: { $eq: req.query._id } });
    const updatedDocument = await IssueModel.updateOne({ _id: { $eq: req.query._id } }, { is_locked: !foundDocument.is_locked }, { new: true });
    if (!updatedDocument) return await res.status(404).json({ message: `Issue with _id: ${req.query._id} not found.` });
    return await res.status(200).json(updatedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Issue.' });
  }

  //
}