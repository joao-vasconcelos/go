import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { DateModel } from '@/schemas/Date/model';

/* * */
/* CREATE DATE */
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
    await checkAuthentication({ scope: 'dates', permission: 'create_edit', req, res });
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
  // Connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4.
  // Ensure latest schema modifications
  // in the schema are applied in the database.

  try {
    await DateModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // Save new documents from req.body

  try {
    let createdDocuments = [];
    for (const dateObject of req.body) {
      const createdDocument = await DateModel.findOneAndUpdate({ date: dateObject.date }, dateObject, { new: true, upsert: true });
      createdDocuments.push(createdDocument);
    }
    return await res.status(201).json(createdDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Date.' });
  }
}
