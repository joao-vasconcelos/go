import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Default as PatternDefault } from '../../../schemas/Pattern/default';
import { Model as PatternModel } from '../../../schemas/Pattern/model';

/* * */
/* CREATE PATTERN */
/* Explanation needed. */
/* * */

export default async function patternsCreate(req, res) {
  //
  await delay();

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Parse request body into JSON
  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 2. Try to save a new document with req.body
  try {
    const newPattern = { ...PatternDefault, code: req.body.code, parent_route: req.body.parent_route, direction: req.body.direction };
    const createdDocument = await PatternModel(newPattern).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Pattern.' });
  }
}
