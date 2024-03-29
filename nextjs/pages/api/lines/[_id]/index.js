/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;
  let lineDocument;

  // 2.
  // Get session data

  try {
    sessionData = await getSession(req, res);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'lines', action: 'view' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Fetch the requested document

  try {
    lineDocument = await LineModel.findOne({ _id: { $eq: req.query._id } });
    if (!lineDocument) return await res.status(404).json({ message: `Line with _id "${req.query._id}" not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: `Error fetching Line with _id "${req.query._id}" from the database.` });
  }

  // 5.
  // Synchronize descendant routes for this line

  try {
    const allDescendantRoutesForThisLine = await RouteModel.find({ parent_line: { $eq: lineDocument._id } }, '_id');
    lineDocument.routes = allDescendantRoutesForThisLine.map((item) => item._id);
    await lineDocument.save();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: `Error synchronizing descendant Routes for the Line with _id "${lineDocument._id}".` });
  }

  // 6.
  // Return requested document to the caller

  try {
    return await res.status(200).json(lineDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Error sending response to client.' });
  }

  //
}
