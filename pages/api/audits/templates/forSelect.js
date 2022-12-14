import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import { Model } from '../../../../schemas/audits/templates';

/* * */
/* API > AUDITS > TEMPLATES > LIST */
/* This endpoint returns all templates from MongoDB. */
/* * */

export default async function auditsTemplatesList(req, res) {
  //
  await delay();

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 2. Try to list all documents
  try {
    const allDocuments = await Model.find({}).limit(1000);
    const allDocumentsFormatted = allDocuments.map((document) => {
      return { label: document.title, value: document._id };
    });
    return await res.status(200).send(allDocumentsFormatted);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Audit Templates.' });
  }
}
