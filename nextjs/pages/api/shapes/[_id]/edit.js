import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import * as turf from '@turf/turf';
import { Validation as ShapeValidation } from '../../../../schemas/Shape/validation';
import { Model as ShapeModel } from '../../../../schemas/Shape/model';

/* * */
/* EDIT SHAPE */
/* Explanation needed. */
/* * */

export default async function shapesEdit(req, res) {
  //
  await delay();

  //
  // 0. Refuse request if not PUT

  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  //
  // 1. Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  //
  // 2. Validate req.body against schema

  try {
    req.body = ShapeValidation.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  //
  // 3. Try to connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  //
  // 4. Check for uniqueness

  try {
    // The values that need to be unique are ['code'].
    const foundDocumentWithShapeCode = await ShapeModel.exists({ code: req.body.code });
    if (foundDocumentWithShapeCode && foundDocumentWithShapeCode._id != req.query._id) {
      throw new Error('Uma Shape com o mesmo Código já existe.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  //
  // 5. Update geojson shape from points, if shape has points

  if (req.body.points && req.body.points.length) {
    try {
      // Sort points to match sequence
      req.body.points.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence);
      // Create geojson feature using turf
      req.body.geojson = turf.lineString(req.body.points.map((point) => [parseFloat(point.shape_pt_lon), parseFloat(point.shape_pt_lat)]));
      // Calculate shape extension from geojson feature
      const extensionInKilometers = turf.length(req.body.geojson, { units: 'kilometers' });
      const extensionInMeters = extensionInKilometers * 1000;
      req.body.extension = Math.round(extensionInMeters).toFixed(2);
    } catch (err) {
      console.log(err);
      return await res.status(500).json({ message: 'Could not handle points in Shape.' });
    }
  } else {
    try {
      // Reset geojson and extension if shape has no points
      req.body.geojson = null;
      req.body.extension = 0;
    } catch (err) {
      console.log(err);
      return await res.status(500).json({ message: 'Could not handle no points in Shape.' });
    }
  }

  // 4. Try to update the correct document
  try {
    const editedDocument = await ShapeModel.findOneAndUpdate({ _id: req.query._id }, req.body, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `Shape with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Shape.' });
  }
}
