import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Model as RouteModel } from '@/schemas/Route/model';

/* * */
/* LOCK ROUTE */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'routes', permission: 'lock', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 3.
  // Connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4.
  // Lock or unlock the requested document

  try {
    const foundDocument = await RouteModel.findOneAndUpdate({ _id: { $eq: req.query._id } }, { is_locked: req.body.is_locked ? true : false }, { new: true });
    if (!foundDocument) return await res.status(404).json({ message: `Route with _id: ${req.query._id} not found.` });
    return await res.status(200).json(foundDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Route.' });
  }
}
