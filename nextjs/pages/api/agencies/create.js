import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Default as AgencyDefault } from '../../../schemas/Agency/default';
import { Model as AgencyModel } from '../../../schemas/Agency/model';

/* * */
/* CREATE AGENCY */
/* Explanation needed. */
/* * */

export default async function agenciesCreate(req, res) {
  //
  await delay();

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 2. Try to save a new document with req.body
  try {
    const createdDocument = await AgencyModel(AgencyDefault).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Agency.' });
  }
}
