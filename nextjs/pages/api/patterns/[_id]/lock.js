import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */
/* LOCK PATTERN */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Setup variables

  let parsedData;
  let patternDocument;

  // 1.
  // Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'lines', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
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
  // Ensure latest schema modifications are applied in the database

  try {
    await LineModel.syncIndexes();
    await RouteModel.syncIndexes();
    await PatternModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // Parse request body into JSON

  try {
    parsedData = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 6.
  // Retrieve requested document from the database

  try {
    patternDocument = await PatternModel.findOne({ _id: { $eq: req.query._id } });
    if (!patternDocument) return await res.status(404).json({ message: `Pattern with _id: ${req.query._id} not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Pattern not found.' });
  }

  // 7.
  // Check if parent route is locked

  try {
    const routeDocument = await RouteModel.findOne({ _id: { $eq: patternDocument.parent_route } });
    if (!routeDocument) return await res.status(404).json({ message: `Route with _id: ${patternDocument.parent_route} not found.` });
    if (routeDocument.is_locked) return await res.status(423).json({ message: 'Parent Route is locked.' });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Parent Route not found.' });
  }

  // 4.
  // Lock or unlock the requested document

  try {
    // Set new lock status
    const newLockStatus = parsedData.is_locked ? true : false;
    // Update the pattern document
    patternDocument.is_locked = newLockStatus;
    // Save the changes
    await patternDocument.save();
    //
    return await res.status(200).json(patternDocument);
    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Route or its associated Patterns.' });
  }
}
