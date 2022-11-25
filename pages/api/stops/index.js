import database from '../../../services/database';
import Model from '../../../models/Stop';

/* * */
/* GET ALL STOPS */
/* This endpoint return all bus stops from the database. */
/* * */

export default async function appVersion(req, res) {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Database connection error.' });
  }

  // 2. Try to fetch all stops from the database
  try {
    const allStops = await Model.find({}).limit(1000);
    return await res.status(200).send(allStops);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch Stops.' });
  }
}
