import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import { Default as PatternDefault } from '../../../../schemas/Pattern/default';
import { Model as PatternModel } from '../../../../schemas/Pattern/model';
import { Model as StopModel } from '../../../../schemas/Stop/model';

/* * */
/* IMPORT PATTERN */
/* Explanation needed. */
/* * */

export default async function patternsImport(req, res) {
  //
  await delay();

  // 0. Refuse request if not PUT
  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Parse request body into JSON
  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 3. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4. Replace the path for this pattern
  try {
    // Get current pattern from db
    const documentToUpdate = await PatternModel.findOne({ _id: req.query._id });
    // Reset path stop
    documentToUpdate.path = [];

    req.body = req.body.sort((a, b) => a.stop_sequence - b.stop_sequence);
    // Initiate variable to hold distance
    let prevDistance = 0;
    // Iterate on each path stop
    for (const [pathIndex, pathItem] of req.body.entries()) {
      // Get _id of associated Stop document
      const associatedStopDocument = await StopModel.findOne({ code: pathItem.stop_id });
      // Calculate distance delta
      const distanceDelta = pathIndex === 0 ? 0 : pathItem.shape_dist_traveled * 1000 - prevDistance;
      prevDistance = pathItem.shape_dist_traveled;
      // Add this sequence item to the document path
      documentToUpdate.path.push({
        ...PatternDefault.path[0],
        distance_delta: distanceDelta,
        stop: associatedStopDocument._id,
        zones: associatedStopDocument.zones,
      });
    }
    // Save changes to document
    documentToUpdate.save();
    // Return updated document
    return await res.status(200).json(documentToUpdate);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Pattern.' });
  }

  //
}
