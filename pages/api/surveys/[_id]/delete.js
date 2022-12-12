import mongodb from '../../../../services/mongodb';
import Model from '../../../../models/Survey';
import delay from '../../../../utils/delay';

/* * */
/* DELETE SURVEY */
/* Explanation needed. */
/* * */

export default async function surveysDelete(req, res) {
  //
  await delay();

  // 0. Refuse request if not DELETE
  if (req.method != 'DELETE') {
    await res.setHeader('Allow', ['DELETE']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
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
    const deletedDocument = await Model.findOneAndDelete({ _id: req.query._id });
    if (!deletedDocument)
      return await res.status(404).json({ message: `Survey with _id: ${req.query._id} not found.` });
    await delay(5000);
    return await res.status(200).send(deletedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot delete this Survey.' });
  }
}
