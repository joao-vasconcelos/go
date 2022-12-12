import delay from '../../../../../utils/delay';
import mongodb from '../../../../../services/mongodb';
import { Model } from '../../../../../schemas/audits/templates';

/* * */
/* API > AUDITS > TEMPLATES > GET */
/* This endpoint returns all templates from MongoDB. */
/* * */

export default async function auditsTemplatesGet(req, res) {
  //
  await delay();

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
    return;
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'MongoDB connection error.' });
    return;
  }

  // 2. Try to fetch the correct document
  try {
    const foundDocument = await Model.findOne({ _id: req.query._id });
    if (!foundDocument) {
      return await res.status(404).json({ message: `Audit Template with _id: ${req.query._id} not found.` });
    } else {
      return await res.status(200).json(foundDocument);
    }
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch this Audit Template.' });
  }
}
