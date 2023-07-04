import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import * as turf from '@turf/turf';
import { PatternDefault, PatternShapeDefault, PatternPathDefault } from '@/schemas/Pattern/default';
import { PatternModel } from '@/schemas/Pattern/model';
import { Model as StopModel } from '@/schemas/Stop/model';

/* * */
/* IMPORT PATTERN */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
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

  // 4.
  // Connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  //

  // Get current pattern from db
  const patternDocumentToUpdate = await PatternModel.findOne({ _id: { $eq: req.query._id } });

  //
  // UPDATE SHAPE

  if (req.body.shape && req.body.shape.length) {
    try {
      // Initiate pattern shape
      patternDocumentToUpdate.shape = { ...PatternShapeDefault };
      // Sort points to match sequence
      patternDocumentToUpdate.shape.points = req.body.shape.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence);
      // Create geojson feature using turf
      patternDocumentToUpdate.shape.geojson = turf.lineString(patternDocumentToUpdate.shape.points.map((point) => [parseFloat(point.shape_pt_lon), parseFloat(point.shape_pt_lat)]));
      // Calculate shape extension from geojson feature
      const extensionInKilometers = turf.length(patternDocumentToUpdate.shape.geojson, { units: 'kilometers' });
      const extensionInMeters = extensionInKilometers * 1000;
      patternDocumentToUpdate.shape.extension = parseInt(extensionInMeters);
    } catch (err) {
      console.log(err);
      return await res.status(500).json({ message: 'Could not handle points in Shape.' });
    }
  } else {
    try {
      // Reset geojson and extension if shape has no points
      patternDocumentToUpdate.shape = { ...PatternShapeDefault };
    } catch (err) {
      console.log(err);
      return await res.status(500).json({ message: 'Could not handle no points in Shape.' });
    }
  }

  //
  // UPDATE PATH

  try {
    // Reset geojson and extension if shape has no points
    req.body.path.sort((a, b) => a.stop_sequence - b.stop_sequence);
    // Initiate temp variable to keep formatted path
    let formattedPath = [];
    // Initiate variable to hold distance
    let prevDistance = 0;
    // Iterate on each path stop
    for (const [pathIndex, pathItem] of req.body.path.entries()) {
      // Get _id of associated Stop document
      const associatedStopDocument = await StopModel.findOne({ code: pathItem.stop_id });
      // Calculate distance delta
      const distanceDelta = pathIndex === 0 ? 0 : Number(pathItem.shape_dist_traveled) - prevDistance;
      prevDistance = Number(pathItem.shape_dist_traveled);
      // Add this sequence item to the document path
      formattedPath.push({
        ...PatternPathDefault,
        distance_delta: distanceDelta,
        stop: associatedStopDocument._id,
        zones: associatedStopDocument.zones,
      });
    }

    patternDocumentToUpdate.path = formattedPath;
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not handle no stops in Path.' });
  }

  // 4. Replace the path for this pattern
  try {
    // Save changes to document
    patternDocumentToUpdate.save();
    // Return updated document
    return await res.status(200).json(patternDocumentToUpdate);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Pattern.' });
  }

  //
}
