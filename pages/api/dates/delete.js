import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Model as DateModel } from '../../../schemas/Date/model';

/* * */
/* DELETE DATES */
/* Explanation needed. */
/* * */

export default async function datesDelete(req, res) {
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

  // 2. Try to update the correct document
  try {
    let deletedDocuments = [];
    for (const dateObject of req.body) {
      const deletedDocument = await DateModel.findOneAndDelete({ date: dateObject.date });
      deletedDocuments.push(deletedDocument);
    }
    return await res.status(201).json(deletedDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot delete this Date.' });
  }
}
