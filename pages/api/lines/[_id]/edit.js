import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import { Validation as LineValidation } from '../../../../schemas/Line/validation';
import { Model as LineModel } from '../../../../schemas/Line/model';
import { Model as RouteModel } from '../../../../schemas/Route/model';

/* * */
/* EDIT LINE */
/* Explanation needed. */
/* * */

export default async function linesEdit(req, res) {
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
    req.body = LineValidation.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message });
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
    const foundDocumentWithLineId = await LineModel.exists({ code: req.body.code });
    if (foundDocumentWithLineId && foundDocumentWithLineId._id != req.query._id) {
      throw new Error('Uma Linha com o mesmo Código já existe.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 5. Update nested routes with correct code
  try {
    if (req.body.routes.length) {
      for (const [routeIndex, routeData] of req.body.routes.entries()) {
        const routeDocument = await RouteModel.findOne({ _id: routeData._id });
        routeDocument.code = `${req.body.code}_${routeIndex}`;
        await routeDocument.save();
      }
    }
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: err.message });
  }

  // 2. Try to update the correct document
  try {
    const editedDocument = await LineModel.findOneAndUpdate({ _id: req.query._id }, req.body, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `Line with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Line.' });
  }

  //
}
