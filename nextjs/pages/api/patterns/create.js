/* * */

import mongodb from '@/services/mongodb';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import generator from '@/services/generator';
import { PatternDefault } from '@/schemas/Pattern/default';
import { PatternModel } from '@/schemas/Pattern/model';
import { RouteModel } from '@/schemas/Route/model';

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
    isAllowed(sessionData, [{ scope: 'lines', action: 'create' }]);
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
  // Save a new document with default values

  try {
    // Get parent Route document
    const parentRouteDocument = await RouteModel.findOne({ _id: { $eq: req.body.parent_route } });
    // Set an available code for the new Route
    let newPatternCode = `${parentRouteDocument.code}_${generator({ length: 2, type: 'numeric' })}`;
    while (await PatternModel.exists({ code: newPatternCode })) {
      newPatternCode = `${parentRouteDocument.code}_${generator({ length: 2, type: 'numeric' })}`;
    }
    // Create the new Route document
    const newPattern = { ...PatternDefault, code: newPatternCode, parent_route: parentRouteDocument._id, direction: req.body.direction };
    const createdDocument = await PatternModel(newPattern).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Pattern.' });
  }

  //
}
