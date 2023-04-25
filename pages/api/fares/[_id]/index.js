import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import { Model as FareModel } from '../../../../schemas/Fare/model';

/* * */
/* GET AGENCY BY ID */
/* Explanation needed. */
/* * */

export default async function faresGet(req, res) {
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
    const foundDocument = await FareModel.findOne({ _id: req.query._id });
    if (!foundDocument) return await res.status(404).json({ message: `Fare with _id: ${req.query._id} not found.` });
    return await res.status(200).json(foundDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch this Fare.' });
  }
}
