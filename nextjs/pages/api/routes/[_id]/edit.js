/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { RouteValidation } from '@/schemas/Route/validation';
import { RouteModel } from '@/schemas/Route/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;
  let routeDocument;

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
    await prepareApiEndpoint({ request: req, method: 'PUT', session: sessionData, permissions: [{ scope: 'lines', action: 'edit' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 5.
  // Validate req.body against schema

  try {
    req.body = RouteValidation.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 6.
  // Retrieve requested document from the database

  try {
    routeDocument = await RouteModel.findOne({ _id: { $eq: req.query._id } });
    if (!routeDocument) return await res.status(404).json({ message: `Route with _id "${req.query._id}" not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Route not found.' });
  }

  // 7.
  // Check for uniqueness

  try {
    // The values that need to be unique are ['code'].
    const foundDocumentWithRouteCode = await RouteModel.exists({ code: { $eq: req.body.code } });
    if (foundDocumentWithRouteCode && foundDocumentWithRouteCode._id != req.query._id) {
      throw new Error('An Route with the same "code" already exists.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 8.
  // Check if document is locked

  if (routeDocument.is_locked) {
    return await res.status(423).json({ message: 'Route is locked.' });
  }

  // 9.
  // Update the requested document

  try {
    const editedDocument = await RouteModel.updateOne({ _id: { $eq: req.query._id } }, req.body, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `Route with _id "${req.query._id}" not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Route.' });
  }

  //
}
