import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';

/* * */
/* GET LINE BY ID */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Setup variables

  let lineDocument;

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
    await LineModel.syncIndexes();
    await RouteModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // Fetch the requested document

  try {
    lineDocument = await LineModel.findOne({ _id: { $eq: req.query._id } });
    if (!lineDocument) return await res.status(404).json({ message: `Line with _id "${req.query._id}" not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: `Error fetching Line with _id "${req.query._id}" from the database.` });
  }

  // 6.
  // Synchronize descendant routes for this line

  try {
    const allDescendantRoutesForThisLine = await RouteModel.find({ parent_line: { $eq: lineDocument._id } }, '_id');
    lineDocument.routes = allDescendantRoutesForThisLine.map((item) => item._id);
    await lineDocument.save();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: `Error synchronizing descendant Routes for the Line with _id "${lineDocument._id}".` });
  }

  // 7.
  // Return requested document to the caller

  try {
    return await res.status(200).json(lineDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Error sending response to client.' });
  }

  //
}
