import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Validation as MessageValidation } from '@/schemas/Message/validation';
import { Model as MessageModel } from '@/schemas/Message/model';

/* * */
/* CREATE MESSAGE */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not POST

  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'agencies', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 3.
  // Validate req.body against schema

  try {
    req.body = MessageValidation.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message });
  }

  // 4.
  // Connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 6.
  // Save a new document

  try {
    const createdDocument = await MessageModel(req.body).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Message.' });
  }
}