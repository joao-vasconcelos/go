import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import { Model as AgencyModel } from '../../../../schemas/Agency/model';

/* * */
/* DELETE USER */
/* Explanation needed. */
/* * */

export default async function agenciesDelete(req, res) {
  //
  await delay();

  // 0. Refuse request if not DELETE
  if (req.method != 'DELETE') {
    await res.setHeader('Allow', ['DELETE']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 2. Try to update the correct document
  try {
    const deletedDocument = await AgencyModel.findOneAndDelete({ agency_id: req.query.agency_id });
    if (!deletedDocument) return await res.status(404).json({ message: `Agency with agency_id: ${req.query.agency_id} not found.` });
    return await res.status(200).send(deletedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot delete this Agency.' });
  }
}
