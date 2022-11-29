import mongodb from '../../../services/mongodb';
import Model from '../../../models/Audit';

/* * */
/* GET ALL AUDITS */
/* This endpoint return all bus stops from the mongodb. */
/* * */

export default async function allAudits(req, res) {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 2. Try to fetch all documents from mongodb
  try {
    const allAudits = await Model.find({}).limit(1000);
    return await res.status(200).send(allAudits);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch Audits.' });
  }
}
