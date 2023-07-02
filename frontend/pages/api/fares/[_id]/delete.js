import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import { Model as FareModel } from '../../../../schemas/Fare/model';

/* * */
/* DELETE FARE */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not DELETE

  if (req.method != 'DELETE') {
    await res.setHeader('Allow', ['DELETE']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'fares', permission: 'delete', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 3.
  // Delete the requested document

  try {
    const deletedDocument = await FareModel.findOneAndDelete({ _id: { $eq: req.query._id } });
    if (!deletedDocument) return await res.status(404).json({ message: `Fare with _id: ${req.query._id} not found.` });
    return await res.status(200).send(deletedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot delete this Fare.' });
  }
}
