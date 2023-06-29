import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Model as ThreadModel } from '../../../schemas/Thread/model';

/* * */
/* LIST ALL THREADS */
/* This endpoint returns all threads. */
/* * */

export default async function threadsList(req, res) {
  //
  await delay();

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
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
    const allDocuments = await ThreadModel.find({});
    return await res.status(200).send(allDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Threads.' });
  }
}
