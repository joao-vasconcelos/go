import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { AlertDefault } from '@/schemas/Alert/default';
import { AlertModel } from '@/schemas/Alert/model';

/* * */
/* CREATE ALERT */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Define "semi-global"-scoped variables to be used later on in the function

  let session;

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    session = await checkAuthentication({ scope: 'alerts', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 3.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4.
  // Save a new document with default values

  try {
    const createdDocument = await AlertModel({ ...AlertDefault, created_by: session.user._id }).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Alert.' });
  }
}
