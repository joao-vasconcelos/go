import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import { Validation, Model } from '../../../../schemas/Audit';

/* * */
/* EDIT AUDIT */
/* Explanation needed. */
/* * */

export default async function auditsEdit(req, res) {
  //
  await delay();

  // 0. Refuse request if not PUT
  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Parse request body into JSON
  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
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
    // The only value that needs to, and can be, unique is 'unique_code'.
    if (req.body.unique_code) {
      const foundUniqueCode = await Model.findOne({ unique_code: req.body.unique_code });
      if (foundUniqueCode && foundUniqueCode._id != req.query._id)
        throw new Error('An Audit with the same unique_code already exists.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 2. Try to edit the correct document
  try {
    const editedDocument = await Model.findOneAndReplace({ _id: req.query._id }, req.body);
    if (!editedDocument) return await res.status(404).json({ message: `Audit with _id: ${req.query._id} not found.` });
    // console.log(req.body);
    // console.log(editedDocument);
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot edit this Audit.' });
  }
}