import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Model as StopModel } from '../../../schemas/Stop/model';

/* * */
/* LIST ALL AGENCIES */
/* This endpoint returns all stops. */
/* * */

export default async function stopsList(req, res) {
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
    const allDocuments = await StopModel.find({}, 'stop_code stop_name stop_lat stop_lon'); //.limit(500);
    return await res.status(200).send(allDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Stops.' });
  }
}
