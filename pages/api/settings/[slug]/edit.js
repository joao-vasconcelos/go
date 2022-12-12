import mongodb from '../../../../services/mongodb';
import Model from '../../../../models/Setting';
import Schema from '../../../../schemas/Setting';
import delay from '../../../../utils/delay';

/* * */
/* EDIT SETTING */
/* Explanation needed. */
/* * */

export default async function settingsEdit(req, res) {
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
    // The only value that needs to, and can be, unique is 'slug'.
    if (req.body.slug) {
      const foundUniqueCode = await Model.findOne({ slug: req.body.slug });
      if (foundUniqueCode && foundUniqueCode.slug != req.query.slug)
        throw new Error('A Setting with the same slug already exists.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 2. Try to edit the correct document
  try {
    const editedDocument = await Model.findOneAndReplace({ slug: req.query.slug }, req.body, { new: true });
    if (!editedDocument)
      return await res.status(404).json({ message: `Setting with slug: ${req.query.slug} not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot edit this Setting.' });
  }
}
