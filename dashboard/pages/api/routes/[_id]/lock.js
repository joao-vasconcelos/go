import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */
/* LOCK ROUTE, PATTERN */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Setup variables

  let parsedData;
  let routeDocument;

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
    routeDocument = await RouteModel.findOne({ _id: { $eq: req.query._id } });
    if (!routeDocument) return await res.status(404).json({ message: `Route with _id: ${req.query._id} not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Route not found.' });
  }

  // 7.
  // Check if parent line is locked

  try {
    const lineDocument = await LineModel.findOne({ _id: { $eq: routeDocument.parent_line } });
    if (!lineDocument) return await res.status(404).json({ message: `Line with _id: ${routeDocument.parent_line} not found.` });
    if (lineDocument.is_locked) return await res.status(423).json({ message: 'Parent Line is locked.' });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Parent Line not found.' });
  }

  // 4.
  // Lock or unlock the requested document, as well as the associated child documents

  try {
    // Set new lock status
    const newLockStatus = parsedData.is_locked ? true : false;
    // Update the route document
    routeDocument.is_locked = newLockStatus;
    // For each pattern associated with this route
    for (const patternId of routeDocument.patterns) {
      // Get the pattern document
      const patternDocument = await PatternModel.findOne({ _id: patternId });
      // Set the new lock status
      patternDocument.is_locked = newLockStatus;
      // Save the changes
      await patternDocument.save();
    }
    // Save the changes
    await routeDocument.save();
    //
    return await res.status(200).json(routeDocument);
    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Route or its associated Patterns.' });
  }
}
