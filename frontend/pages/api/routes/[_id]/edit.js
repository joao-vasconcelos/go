import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import { Validation as RouteValidation } from '../../../../schemas/Route/validation';
import { Model as RouteModel } from '../../../../schemas/Route/model';
import { Model as PatternModel } from '../../../../schemas/Pattern/model';

/* * */
/* EDIT ROUTE */
/* Explanation needed. */
/* * */

export default async function routesEdit(req, res) {
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
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 2. Validate req.body against schema
  try {
    req.body = RouteValidation.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 3. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 4. Check for uniqueness
  try {
    // The values that need to be unique are ['code'].
    const foundDocumentWithRouteId = await RouteModel.exists({ code: req.body.code });
    if (foundDocumentWithRouteId && foundDocumentWithRouteId._id != req.query._id) {
      throw new Error('Uma Rota com o mesmo Código já existe.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  //   // 5. Update nested patterns with correct code
  //   try {
  //     for (const [patternIndex, patternId] of req.body.patterns.entries()) {
  //       if (patternIndex > 1) throw new Error('Não podem existir mais do que dois Patterns numa Rota.');
  //       const patternDocument = await PatternModel.findOne({ _id: patternId });
  //       patternDocument.code = `${req.body.code}_${patternIndex}`;
  //       patternDocument.direction = patternIndex;
  //       await PatternModel.findOneAndUpdate({ _id: patternId }, patternDocument);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return await res.status(500).json({ message: err.message });
  //   }

  // 2. Try to update the correct document
  try {
    const editedDocument = await RouteModel.findOneAndUpdate({ _id: req.query._id }, req.body, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `Route with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Route.' });
  }
}