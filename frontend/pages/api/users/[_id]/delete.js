import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Model as UserModel } from '@/schemas/User/model';

/* * */
/* DELETE USER */
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
    await checkAuthentication({ scope: 'users', permission: 'delete', req, res });
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
  // Delete the correct document

  try {
    const deletedDocument = await UserModel.findOneAndDelete({ _id: req.query._id });
    if (!deletedDocument) return await res.status(404).json({ message: `User with _id: ${req.query._id} not found.` });
    return await res.status(200).send(deletedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot delete this User.' });
  }
}
