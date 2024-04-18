/* * */

import mongodb from '@/services/mongodb';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import generator from '@/services/generator';
import { TypologyDefault } from '@/schemas/Typology/default';
import { TypologyModel } from '@/schemas/Typology/model';

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
    isAllowed(sessionData, [{ scope: 'typologies', action: 'create' }]);
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
  // Save a new document with req.body

  try {
    const newDocument = { ...TypologyDefault, code: generator({ length: 5 }) };
    while (await TypologyModel.exists({ code: newDocument.code })) {
      newDocument.code = generator({ length: 5 });
    }
    const createdDocument = await TypologyModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot create this Typology.' });
  }

  //
}
