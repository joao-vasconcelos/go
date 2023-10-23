import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import * as turf from '@turf/turf';
import { PatternShapeDefault, PatternPathDefault } from '@/schemas/Pattern/default';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
import calculateTravelTime from '@/services/calculateTravelTime';

/* * */
/* IMPORT PATTERN */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 1.
  // Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'lines', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 3.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
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
  // Get current pattern from MongoDB

  const patternDocumentToUpdate = await PatternModel.findOne({ _id: { $eq: req.query._id } }).populate('path.stop');

  // 6.
  // Update Shape

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

  // 7.
  // Update Path

  try {
    // Sort path stops based on stop_sequence
    req.body.path.sort((a, b) => a.stop_sequence - b.stop_sequence);
    // Initiate temp variable to keep formatted path
    let formattedPath = [];
    // Initiate variable to hold distance
    let prevDistance = 0;
    // Iterate on each path stop
    for (const [pathIndex, pathItem] of req.body.path.entries()) {
      // Get _id of associated Stop document
      const associatedStopDocument = await StopModel.findOne({ code: pathItem.stop_id });
      // Throw an error if no stop is found
      if (!associatedStopDocument) throw Error('This pattern contains one or more stops that do not exist.');
      // Get original path stop from non-modified document
      const originalPathStop = patternDocumentToUpdate.path.find((item) => item.stop.id === associatedStopDocument.id);
      // Calculate distance delta
      const distanceDelta = pathIndex === 0 ? 0 : parseInt(pathItem.shape_dist_traveled) - prevDistance;
      prevDistance = parseInt(pathItem.shape_dist_traveled);
      // Calculate travel time
      const travelTime = calculateTravelTime(distanceDelta, patternDocumentToUpdate.presets.velocity || PatternPathDefault.default_velocity);
      // Add this sequence item to the document path
      formattedPath.push({
        // Include the defaults
        ...PatternPathDefault,
        // Replace defaults with geographical data specific to the updated pattern
        default_travel_time: travelTime,
        distance_delta: distanceDelta,
        stop: associatedStopDocument._id,
        // Replace defaults with original data, if path stop is available; otherwise use presets or defaults
        default_velocity: originalPathStop?.default_velocity || patternDocumentToUpdate.presets.velocity || PatternPathDefault.default_velocity,
        default_dwell_time: originalPathStop?.default_dwell_time || patternDocumentToUpdate.presets.dwell_time || PatternPathDefault.default_dwell_time,
        zones: originalPathStop?.zones || associatedStopDocument.zones,
        allow_pickup: originalPathStop?.allow_pickup || PatternPathDefault.allow_pickup,
        allow_drop_off: originalPathStop?.allow_drop_off || PatternPathDefault.allow_drop_off,
      });
    }
    //
    patternDocumentToUpdate.path = formattedPath;
    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: err.message || 'Error processing path.' });
  }

  // 8.
  // Replace the path for this pattern

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
