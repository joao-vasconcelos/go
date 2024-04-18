/* * */

import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';

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
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'PUT', session: sessionData, permissions: [{ scope: 'lines', action: 'lock' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Retrieve the requested document

  try {
    lineDocument = await LineModel.findOne({ _id: { $eq: req.query._id } });
    if (!lineDocument) return await res.status(404).json({ message: `Line with _id "${req.query._id}" not found.` });
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Line not found.' });
  }

  // 5.
  // Check for valid permissions on the current document context

  try {
    isAllowed(sessionData, [{ scope: 'lines', action: 'lock', fields: [{ key: 'agencies', values: [lineDocument.agency] }] }]);
  } catch (error) {
    console.log(error);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 6.
  // Lock or unlock the requested document, as well as the associated child documents

  try {
    lineDocument.is_locked = !lineDocument.is_locked;
    for (const routeId of lineDocument.routes) {
      const routeDocument = await RouteModel.findOneAndUpdate({ _id: routeId }, { is_locked: lineDocument.is_locked }, { new: true });
      for (const patternId of routeDocument.patterns) {
        await PatternModel.findOneAndUpdate({ _id: patternId }, { is_locked: lineDocument.is_locked }, { new: true });
      }
    }
    await lineDocument.save();
    return await res.status(200).json(lineDocument);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot update this Line or its associated Routes and Patterns.' });
  }

  //
}
