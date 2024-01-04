import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */
/* GET ROUTE BY ID */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Setup variables

  let routeDocument;

  // 1.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'lines', permission: 'view', req, res });
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
    await RouteModel.syncIndexes();
    await PatternModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // Fetch the requested document

  try {
    routeDocument = await RouteModel.findOne({ _id: { $eq: req.query._id } });
    if (!routeDocument) return await res.status(404).json({ message: `Route with _id "${req.query._id}" not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: `Error fetching Route with _id "${req.query._id}" from the database.` });
  }

  // 6.
  // Synchronize descendant patterns for this route

  try {
    const allDescendantPatternsForThisRoute = await PatternModel.find({ parent_route: { $eq: routeDocument._id } }, '_id');
    routeDocument.patterns = allDescendantPatternsForThisRoute.map((item) => item._id);
    await routeDocument.save();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: `Error synchronizing descendant Patterns for the Route with _id "${routeDocument._id}".` });
  }

  // 7.
  // Return requested document to the caller

  try {
    return await res.status(200).json(routeDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Error sending response to client.' });
  }

  //
}
