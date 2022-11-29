import mongodb from '../../../../services/mongodb';
import Model from '../../../../models/Audit';

/* * */
/* DELETE AUDIT */
/* Explanation needed. */
/* * */

export default async function auditDelete(req, res) {
  //

  // 0. Refuse request if not DELETE
  if (req.method != 'DELETE') {
    await res.setHeader('Allow', ['DELETE']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 2. Try to delete the correct document
  try {
    const deletedAudit = await Model.findOneAndDelete({ _id: req.query._id });
    if (!deletedAudit) return await res.status(404).json({ message: `Audit with _id: ${req.query._id} not found.` });
    return await res.status(200).send(deletedAudit);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot delete this Audit.' });
  }
}
