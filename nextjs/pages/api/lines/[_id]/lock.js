/* * */

import mongodb from '@/services/mongodb';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;
  let lineDocument;

  // 2.
  // Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 3.
  // Check for correct Authentication and valid Permissions

  try {
    sessionData = await getSession(req, res);
    isAllowed(sessionData, [{ scope: 'lines', action: 'lock' }]);
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 4.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Retrieve the requested document

  try {
    lineDocument = await LineModel.findOne({ _id: { $eq: req.query._id } });
    if (!lineDocument) return await res.status(404).json({ message: `Line with _id: ${req.query._id} not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Line not found.' });
  }

  // 6.
  // Lock or unlock the requested document, as well as the associated child documents

  try {
    lineDocument.is_locked = !lineDocument.is_locked;
    for (const routeId of lineDocument.routes) {
      const routeDocument = await RouteModel.findOneAndUpdate({ _id: routeId }, { is_locked: lineDocument.is_locked }, { new: true });
      for (const patternId of routeDocument.patterns) {
        await PatternModel.findOneAndUpdate({ _id: patternId }, { is_locked: lineDocument.is_locked }, { new: true });
      }
    }
    await lineDocument.save();
    return await res.status(200).json(lineDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Line or its associated Routes and Patterns.' });
  }

  //
}
