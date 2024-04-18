/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { ZoneValidation } from '@/schemas/Zone/validation';
import { ZoneModel } from '@/schemas/Zone/model';

/* * */

export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;
  let foundDocument;

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
    await prepareApiEndpoint({ request: req, method: 'PUT', session: sessionData, permissions: [{ scope: 'zones', action: 'edit' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
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

  // 5.
  // Validate req.body against schema

  try {
    req.body = ZoneValidation.cast(req.body);
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 6.
  // Retrieve requested document from the database

  try {
    foundDocument = await ZoneModel.findOne({ _id: { $eq: req.query._id } });
    if (!foundDocument) return await res.status(404).json({ message: `Zone with _id "${req.query._id}" not found.` });
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Zone not found.' });
  }

  // 7.
  // Check if document is locked

  if (foundDocument.is_locked) {
    return await res.status(423).json({ message: 'Zone is locked.' });
  }

  // 8.
  // Check for uniqueness

  try {
    // The values that need to be unique are ['code'].
    const foundDocumentWithZoneCode = await ZoneModel.exists({ code: { $eq: req.body.code } });
    if (foundDocumentWithZoneCode && foundDocumentWithZoneCode._id != req.query._id) {
      throw new Error('A Zone with the same "code" already exists.');
    }
  } catch (error) {
    console.log(error);
    return await res.status(409).json({ message: err.message });
  }

  // 9.
  // Update the requested document

  try {
    const editedDocument = await ZoneModel.replaceOne({ _id: { $eq: req.query._id } }, req.body, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `Zone with _id "${req.query._id}" not found.` });
    return await res.status(200).json(editedDocument);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot update this Zone.' });
  }

  //
}
