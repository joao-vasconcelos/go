import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Validation as ShapeValidation } from '../../../schemas/Shape/validation';
import { Model as ShapeModel } from '../../../schemas/Shape/model';

/* * */
/* IMPORT SHAPES */
/* Explanation needed. */
/* * */

export default async function shapesImport(req, res) {
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

  // 2. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // Do for multiple shapes

  for (const currentShape of req.body) {
    // 3. Validate req.body against schema
    // let currentShape_casted;
    // try {
    //   currentShape_casted = ShapeValidation.cast(req.body);
    // } catch (err) {
    //   console.log(err);
    //   return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
    // }

    // 2. Try to update the correct document. If it does not exist, create it
    try {
      const importedDocument = await ShapeModel.findOneAndReplace({ shape_id: currentShape.shape_id }, currentShape, { new: true, upsert: true });
      if (!importedDocument) return await res.status(500).json({ message: `Shape with shape_id: ${req.query._id} was not imported.` });
      return await res.status(200).json(importedDocument);
    } catch (err) {
      console.log(err);
      return await res.status(500).json({ message: 'Cannot import this Shape.' });
    }
  }
}
