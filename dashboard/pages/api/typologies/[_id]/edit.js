import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { TypologyValidation } from '@/schemas/Typology/validation';
import { TypologyModel } from '@/schemas/Typology/model';

/* * */
/* EDIT TYPOLOGY */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Setup variables

  let parsedData;
  let typologyDocument;

  // 1.
  // Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'typologies', permission: 'create_edit', req, res });
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
    await TypologyModel.syncIndexes();
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
    parsedData = TypologyValidation.cast(parsedData);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 7.
  // Retrieve requested document from the database

  try {
    typologyDocument = await TypologyModel.findOne({ _id: { $eq: req.query._id } });
    if (!typologyDocument) return await res.status(404).json({ message: `Typology with _id: ${req.query._id} not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Typology not found.' });
  }

  // 8.
  // Check for uniqueness

  try {
    // The values that need to be unique are ['code'].
    const foundDocumentWithTypologyCode = await TypologyModel.exists({ code: { $eq: parsedData.code } });
    if (foundDocumentWithTypologyCode && foundDocumentWithTypologyCode._id != req.query._id) {
      throw new Error('An Typology with the same "code" already exists.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 9.
  // Check if document is locked

  if (typologyDocument.is_locked) {
    return await res.status(423).json({ message: 'Typology is locked.' });
  }

  // 10.
  // Update the requested document

  try {
    const editedDocument = await TypologyModel.updateOne({ _id: { $eq: req.query._id } }, parsedData, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `Typology with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Typology.' });
  }

  //
}
