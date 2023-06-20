import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Default as RouteDefault } from '../../../schemas/Route/default';
import { Model as RouteModel } from '../../../schemas/Route/model';

/* * */
/* CREATE ROUTE */
/* Explanation needed. */
/* * */

export default async function routesCreate(req, res) {
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
    const newRoute = { ...RouteDefault, code: req.body.code, parent_line: req.body.parent_line };
    const createdDocument = await RouteModel(newRoute).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Route.' });
  }
}
