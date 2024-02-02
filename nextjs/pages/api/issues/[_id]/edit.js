/* * */

import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Validation as IssueValidation } from '@/schemas/Issue/validation';
import { Model as IssueModel } from '@/schemas/Issue/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let parsedData;
  let agencyDocument;

  // 2.
  // Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 3.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'issues', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 4.
  // Connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Ensure latest schema modifications are applied in the database

  try {
    await IssueModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 6.
  // Parse request body into JSON

  try {
    parsedData = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 7.
  // Validate req.body against schema

  try {
    parsedData = IssueValidation.cast(parsedData);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 8.
  // Retrieve requested document from the database

  try {
    agencyDocument = await IssueModel.findOne({ _id: { $eq: req.query._id } });
    if (!agencyDocument) return await res.status(404).json({ message: `Issue with _id: ${req.query._id} not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Issue not found.' });
  }

  // 9.
  // Check for uniqueness

  try {
    // The values that need to be unique are ['code'].
    const foundDocumentWithIssueCode = await IssueModel.exists({ code: { $eq: parsedData.code } });
    if (foundDocumentWithIssueCode && foundDocumentWithIssueCode._id != req.query._id) {
      throw new Error('An Issue with the same "code" already exists.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 9.
  // Check if document is locked

  if (agencyDocument.is_locked) {
    return await res.status(423).json({ message: 'Issue is locked.' });
  }

  // 10.
  // Update the requested document

  try {
    const editedDocument = await IssueModel.replaceOne({ _id: { $eq: req.query._id } }, parsedData, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `Issue with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Issue.' });
  }

  //
}