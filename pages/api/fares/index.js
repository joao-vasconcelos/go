import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Model as FareModel } from '../../../schemas/Fare/model';

/* * */
/* LIST ALL FARES */
/* This endpoint returns all fares. */
/* * */

export default async function faresList(req, res) {
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

  // 2. Try to list all documents
  try {
    const allDocuments = await FareModel.find({});
    return await res.status(200).send(allDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Fares.' });
  }
}
