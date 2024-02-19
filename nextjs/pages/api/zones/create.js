/* * */

import mongodb from '@/services/mongodb';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import generator from '@/services/generator';
import { ZoneDefault } from '@/schemas/Zone/default';
import { ZoneModel } from '@/schemas/Zone/model';

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
    isAllowed(sessionData, [{ scope: 'zones', action: 'create' }]);
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
  // Try to save a new document with req.body

  try {
    const newDocument = { ...ZoneDefault, code: generator({ length: 5 }) };
    while (await ZoneModel.exists({ code: newDocument.code })) {
      newDocument.code = generator({ length: 5 });
    }
    const createdDocument = await ZoneModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Zone.' });
  }

  //
}
