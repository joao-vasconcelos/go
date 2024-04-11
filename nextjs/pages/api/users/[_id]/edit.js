/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import ensureUserPermissions from '@/authentication/ensureUserPermissions';
import { UserValidation } from '@/schemas/User/validation';
import { UserModel } from '@/schemas/User/model';

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
    await prepareApiEndpoint({ request: req, method: 'PUT', session: sessionData, permissions: [{ scope: 'users', action: 'edit' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 6.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 7.
  // Validate req.body against schema

  try {
    req.body = UserValidation.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 8.
  // Retrieve requested document from the database

  try {
    foundDocument = await UserModel.findOne({ _id: { $eq: req.query._id } });
    if (!foundDocument) return await res.status(404).json({ message: `User with _id "${req.query._id}" not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'User not found.' });
  }

  // 9.
  // Check if document is locked

  if (foundDocument.is_locked) {
    return await res.status(423).json({ message: 'User is locked.' });
  }

  // 10.
  // Check for uniqueness

  try {
    // The values that need to be unique are ['email'].
    const foundDocumentWithUserEmail = await UserModel.exists({ email: { $eq: req.body.email } });
    if (foundDocumentWithUserEmail && foundDocumentWithUserEmail._id != req.query._id) {
      throw new Error('An User with the same "email" already exists.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 11.
  // Ensure permissions are set correctly

  try {
    req.body.permissions = ensureUserPermissions(req.body.permissions);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: err.message || 'Could not ensure user permissions are correctly formatted.' });
  }

  // 12.
  // Update the requested document

  try {
    const editedDocument = await UserModel.replaceOne({ _id: { $eq: req.query._id } }, req.body);
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this User.' });
  }

  //
}
