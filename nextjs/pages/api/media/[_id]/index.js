/* * */

import mongodb from '@/services/mongodb';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import { MediaModel } from '@/schemas/Media/model';

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
    isAllowed(sessionData, [{ scope: 'media', action: 'view' }]);
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
  // Fetch the requested document

  try {
    const foundDocument = await MediaModel.findOne({ _id: { $eq: req.query._id } });
    if (!foundDocument) return await res.status(404).json({ message: `Media with _id "${req.query._id}" not found.` });
    return await res.status(200).json(foundDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch this Media.' });
  }

  //
}
