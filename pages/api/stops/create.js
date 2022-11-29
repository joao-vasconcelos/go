import mongodb from '../../../services/mongodb';
import Model from '../../../models/Stop';
import Schema from '../../../schemas/Stop';

/* * */
/* CREATE STOP */
/* Explanation needed. */
/* * */

export default async function stopsCreate(req, res) {
  //

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
    req.body = Schema.cast(req.body);
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
    // The only value that needs to, and can be, unique is 'unique_code'.
    if (req.body.unique_code) {
      const existsUniqueCode = await Model.exists({ unique_code: req.body.unique_code });
      if (existsUniqueCode) throw new Error('A Stop with the same unique code already exists.');
    } else {
      throw new Error('Unique Code for this Stop is missing.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
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
