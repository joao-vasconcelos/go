/* * */

import mongodb from '@/services/mongodb';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import generator from '@/services/generator';
import { TagDefault } from '@/schemas/Tag/default';
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
    isAllowed(sessionData, [{ scope: 'tags', action: 'create' }]);
  } catch (error) {
    console.log(error);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 4.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Save a new document with default values

  try {
    const newDocument = { ...TagDefault, label: generator({ length: 5 }), created_at: new Date().toISOString(), created_by: sessionData.user._id };
    while (await TagModel.exists({ label: newDocument.label })) {
      newDocument.label = generator({ length: 5 });
    }
    const createdDocument = await TagModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot create this Tag.' });
  }

  //
}
