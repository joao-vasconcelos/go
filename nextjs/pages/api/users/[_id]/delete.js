/* * */

import mongodb from '@/services/GODB';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import { UserModel } from '@/schemas/User/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;

  // 2.
  // Refuse request if not DELETE

  if (req.method != 'DELETE') {
    await res.setHeader('Allow', ['DELETE']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 3.
  // Check for correct Authentication and valid Permissions

  try {
    sessionData = await getSession(req, res);
    isAllowed(sessionData, [{ scope: 'users', action: 'delete' }]);
  } catch (error) {
    console.log(error);
    return await res.status(401).json({ message: error.message || 'Could not verify Authentication.' });
  }

  // 4.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Delete the correct document

  try {
    const deletedDocument = await UserModel.findOneAndDelete({ _id: { $eq: req.query._id } });
    if (!deletedDocument) return await res.status(404).json({ message: `User with _id "${req.query._id}" not found.` });
    return await res.status(200).send(deletedDocument);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot delete this User.' });
  }

  //
}
