/* * */

import mongodb from '@/services/mongodb';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import { TagModel } from '@/schemas/Tag/model';

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
    isAllowed(sessionData, [{ scope: 'tags', action: 'lock' }]);
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
  // Lock or unlock the requested document

  try {
    const foundDocument = await TagModel.findOne({ _id: { $eq: req.query._id } });
    if (!foundDocument) return await res.status(404).json({ message: `Tag with _id: ${req.query._id} not found.` });
    const updatedDocument = await TagModel.updateOne({ _id: { $eq: foundDocument._id } }, { is_locked: !foundDocument.is_locked }, { new: true });
    return await res.status(200).json(updatedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot lock or unlock this Tag.' });
  }

  //
}
