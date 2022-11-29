import mongodb from '../../../../services/mongodb';
import Model from '../../../../models/Audit';

/* * */
/* GET AUDIT BY ID */
/* Explanation needed. */
/* * */

export default async function getAudit(req, res) {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
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

  // 2. Try to fetch the correct document from mongodb
  try {
    const foundAudit = await Model.findOne({ _id: req.query._id });
    if (!foundAudit) return await res.status(404).json({ message: `Audit with _id: ${req.query._id} not found.` });
    return await res.status(200).json(foundAudit);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch this Audit.' });
  }
}