import delay from '@/services/delay';
import mongodb from '@/services/mongodb';
import generator from '@/services/generator';
import { Default as MunicipalityDefault } from '@/schemas/Municipality/default';
import { Model as MunicipalityModel } from '@/schemas/Municipality/model';

/* * */
/* CREATE MUNICIPALITY */
/* Explanation needed. */
/* * */

export default async function municipalitiesCreate(req, res) {
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

  // 2. Try to save a new document with req.body
  try {
    const newDocument = { ...MunicipalityDefault, code: generator(4, 'numeric') };
    while (await MunicipalityModel.exists({ code: newDocument.code })) {
      newDocument.code = generator(4, 'numeric');
    }
    const createdDocument = await MunicipalityModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Municipality.' });
  }
}
