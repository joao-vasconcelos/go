/* * */

import mongodb from '@/services/mongodb';
import generator from '@/services/generator';
import { Default as TagDefault } from '@/schemas/Tag/default';
import { Model as TagModel } from '@/schemas/Tag/model';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';

/* * */

export default async function handler(req, res) {
  //

  let sessionData;

  // 1.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    const session = await getSession(req, res);
    await isAllowed(session, [{ scope: 'tags', action: 'view' }]);
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 3.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4.
  // Save a new document with default values

  try {
    const newDocument = { ...TagDefault, label: generator({ length: 5 }), created_at: new Date().toISOString(), created_by: sessionData.user._id };
    while (await TagModel.exists({ label: newDocument.label })) {
      newDocument.label = generator({ length: 5 });
    }
    const createdDocument = await TagModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Tag.' });
  }

  //
}
