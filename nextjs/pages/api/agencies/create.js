import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import generator from '@/services/generator';
import { AgencyDefault } from '@/schemas/Agency/default';
import { AgencyModel } from '@/schemas/Agency/model';

/* * */
/* CREATE AGENCY */
/* Explanation needed. */
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
    await checkAuthentication({ scope: 'agencies', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
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
  // Save a new document with default values

  try {
    const newDocument = { ...AgencyDefault, code: generator({ length: 2 }) };
    while (await AgencyModel.exists({ code: newDocument.code })) {
      newDocument.code = generator({ length: 2 });
    }
    const createdDocument = await AgencyModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Agency.' });
  }
}
