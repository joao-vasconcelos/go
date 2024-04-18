/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
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
  // Get session data

  try {
    sessionData = await getSession(req, res);
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'POST', session: sessionData, permissions: [{ scope: 'lines', action: 'edit' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (error) {
    console.log(error);
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
    const newPattern = { ...PatternDefault, code: newPatternCode, parent_line: parentRouteDocument.parent_line, parent_route: parentRouteDocument._id, direction: req.body.direction };
    const createdDocument = await PatternModel(newPattern).save();
    return await res.status(201).json(createdDocument);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot create this Pattern.' });
  }

  //
}
