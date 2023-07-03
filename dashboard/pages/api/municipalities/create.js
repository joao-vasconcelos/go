import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import generator from '@/services/generator';
import { Default as MunicipalityDefault } from '@/schemas/Municipality/default';
import { Model as MunicipalityModel } from '@/schemas/Municipality/model';

/* * */
/* CREATE MUNICIPALITY */
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
    await checkAuthentication({ scope: 'municipalities', permission: 'create_edit', req, res });
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
    const newDocument = { ...MunicipalityDefault, code: generator(5) };
    while (await MunicipalityModel.exists({ code: newDocument.code })) {
      newDocument.code = generator(5);
    }
    return await res.status(201).json(newDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Municipality.' });
  }
}
