import delay from '../../../../services/delay';
import generator from '../../../services/generator';
import mongodb from '../../../services/mongodb';
import { Validation, Model } from '../../../schemas/stops/documents';

/* * */
/* CREATE STOP */
/* Explanation needed. */
/* * */

export default async function stopsCreate(req, res) {
  //
  await delay();

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Try to save a new document with req.body
  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 2. Validate req.body against schema
  try {
    req.body = Validation.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 3. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4. Check for uniqueness
  try {
    // The values that need to be unique are ['unique_code'].
    let uniqueCodeIsNotUnique = true;
    while (uniqueCodeIsNotUnique) {
      req.body.unique_code = generator(6, 'numeric'); // Generate a new code with 6 characters
      uniqueCodeIsNotUnique = await Model.exists({ unique_code: req.body.unique_code });
    }
  } catch (err) {
    console.log(err);
    await res.status(409).json({ message: err.message });
    return;
  }

  // 5. Try to save a new document with req.body
  try {
    const createdDocument = await Model(req.body).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Stop.' });
  }
}
