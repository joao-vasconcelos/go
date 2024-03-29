/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { DateValidation } from '@/schemas/Date/validation';
import { DateModel } from '@/schemas/Date/model';

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
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'PUT', session: sessionData, permissions: [{ scope: 'calendars', action: 'edit_dates' }] });
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
    req.body = DateValidation.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 6.
  // Retrieve requested document from the database

  try {
    foundDocument = await DateModel.findOne({ _id: { $eq: req.query._id } });
    if (!foundDocument) return await res.status(404).json({ message: `Date with _id "${req.query._id}" not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Date not found.' });
  }

  // 7.
  // Check if document is locked

  if (foundDocument.is_locked) {
    return await res.status(423).json({ message: 'Date is locked.' });
  }

  // 8.
  // Check for uniqueness

  try {
    // The values that need to be unique are ['date'].
    const foundDocumentWithDateValue = await DateModel.exists({ date: { $eq: req.body.date } });
    if (foundDocumentWithDateValue && foundDocumentWithDateValue._id != req.query._id) {
      throw new Error('An Date with the same "date" already exists.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 9.
  // Update the requested document

  try {
    const editedDocument = await DateModel.replaceOne({ _id: { $eq: req.query._id } }, req.body, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `Date with _id "${req.query._id}" not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Date.' });
  }

  //
}
