import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Default as DateDefault } from '../../../schemas/Date/default';
import { Model as DateModel } from '../../../schemas/Date/model';

/* * */
/* CREATE DATE */
/* Explanation needed. */
/* * */

export default async function datesCreate(req, res) {
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
