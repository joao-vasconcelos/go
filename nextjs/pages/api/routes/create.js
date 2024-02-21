/* * */

import mongodb from '@/services/mongodb';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import generator from '@/services/generator';
import { RouteDefault } from '@/schemas/Route/default';
import { RouteModel } from '@/schemas/Route/model';
import { LineModel } from '@/schemas/Line/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;

  // 2.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 3.
  // Check for correct Authentication and valid Permissions

  try {
    sessionData = await getSession(req, res);
    isAllowed(sessionData, [{ scope: 'routes', action: 'create' }]);
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 4.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 6.
  // Save a new document with req.body

  try {
    // Get parent Line document
    const parentLineDocument = await LineModel.findOne({ _id: { $eq: req.body.parent_line } });
    // Set an available code for the new Route
    let newRouteCode = `${parentLineDocument.code}_${generator({ length: 2, type: 'numeric' })}`;
    while (await RouteModel.exists({ code: newRouteCode })) {
      newRouteCode = `${parentLineDocument.code}_${generator({ length: 2, type: 'numeric' })}`;
    }
    // Create the new Route document
    const newRoute = { ...RouteDefault, code: newRouteCode, parent_line: req.body.parent_line };
    const createdDocument = await RouteModel(newRoute).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Route.' });
  }

  //
}
