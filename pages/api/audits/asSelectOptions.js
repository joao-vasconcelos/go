import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Model as AuditModel } from '../../../schemas/Audit';

/* * */
/* API > AUDITS > LIST AS SELECT OPTIONS */
/* This endpoint returns all audits from MongoDB. */
/* * */

export default async function auditsListOptions(req, res) {
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
    const allDocuments = await AuditModel.find({}).limit(1000);
    const allDocumentsFormatted = allDocuments.map((document) => {
      return { value: document._id, label: document.unique_code, description: document.template.title };
    });
    return await res.status(200).send(allDocumentsFormatted);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Audits.' });
  }
}
