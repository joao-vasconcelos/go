import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { PatternValidation } from '@/schemas/Pattern/validation';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */
/* EDIT PATTERN */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Setup variables

  let parsedData;
  let patternDocument;

  // 1.
  // Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'lines', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 3.
  // Connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4.
  // Ensure latest schema modifications are applied in the database

  try {
    await PatternModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // Parse request body into JSON

  try {
    parsedData = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 6.
  // Validate req.body against schema

  try {
    parsedData = PatternValidation.cast(parsedData);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 7.
  // Retrieve requested document from the database

  try {
    patternDocument = await PatternModel.findOne({ _id: { $eq: req.query._id } });
    if (!patternDocument) return await res.status(404).json({ message: `Pattern with _id: ${req.query._id} not found.` });
    if (patternDocument.is_locked) return await res.status(423).json({ message: 'Pattern is locked.' });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Pattern not found.' });
  }

  // 8.
  // Check for uniqueness

  try {
    // The values that need to be unique are ['code'].
    const foundDocumentWithPatternCode = await PatternModel.exists({ code: { $eq: parsedData.code } });
    if (foundDocumentWithPatternCode && foundDocumentWithPatternCode._id != req.query._id) {
      throw new Error('A Pattern with the same "code" already exists.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 9.
  // Update the requested document

  try {
    const editedDocument = await PatternModel.replaceOne({ _id: { $eq: req.query._id } }, parsedData, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `Pattern with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Pattern.' });
  }

  //
}
