import mongodb from '../../../../services/mongodb';
import Model from '../../../../models/Stop';

/* * */
/* GET CUSTOMER BY ID */
/* Explanation needed. */
/* * */

export default async function getStop(req, res) {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  // 1. Try to connect to the database
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 2. Try to fetch the correct Object from the database
  try {
    const foundStop = await Model.findOne({ _id: req.query._id });
    if (!foundStop) return await res.status(404).json({ message: `Stop with _id: ${req.query._id} not found.` });
    return await res.status(200).json(foundStop);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch this Stop.' });
  }
}
