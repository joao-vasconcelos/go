import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import generate from '@/services/generator';
import { PatternDefault } from '@/schemas/Pattern/default';
import { PatternModel } from '@/schemas/Pattern/model';
import { Model as RouteModel } from '@/schemas/Route/model';

/* * */
/* CREATE PATTERN */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not POST

  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'lines', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 3.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 3.
  // Save a new document with default values

  try {
    // Get parent Route document
    const parentRouteDocument = await RouteModel.findOne({ _id: { $eq: req.body.parent_route } });
    // Set an available code for the new Route
    let newPatternCode = `${parentRouteDocument.code}_${generate(3)}`;
    while (await PatternModel.exists({ code: newPatternCode })) {
      newPatternCode = `${parentRouteDocument.code}_${generate(3)}`;
    }
    // Create the new Route document
    const newPattern = { ...PatternDefault, code: newPatternCode, parent_route: parentRouteDocument._id, direction: req.body.direction };
    const createdDocument = await PatternModel(newPattern).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Pattern.' });
  }
}
