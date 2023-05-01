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
    // The values that need to be unique are ['_id'].
    const foundDocumentWithLineId = await LineModel.exists({ _id: req.query._id });
    if (foundDocumentWithLineId && foundDocumentWithLineId._id != req.query._id) {
      throw new Error('Uma Linha com o mesmo ID já existe.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 4. Check if nested documents are valid
  try {
    let validRouteIds = [];
    for (const route_id of req.body.routes) {
      const foundDocumentWithRouteId = await RouteModel.exists({ _id: route_id });
      if (foundDocumentWithRouteId) validRouteIds.push(route_id);
    }
    req.body.routes = validRouteIds;
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 2. Try to update the correct document
  try {
    const editedDocument = await LineModel.findOneAndReplace({ _id: req.query._id }, req.body, { new: true });
    if (!editedDocument) return await res.status(404).json({ message: `Line with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Line.' });
  }

  //
}
