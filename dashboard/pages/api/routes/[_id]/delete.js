import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Model as RouteModel } from '@/schemas/Route/model';
import { Model as LineModel } from '@/schemas/Line/model';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */
/* DELETE ROUTE */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not DELETE

  if (req.method != 'DELETE') {
    await res.setHeader('Allow', ['DELETE']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'lines', permission: 'delete', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 3.
  // Delete the requested document

  try {
    //
    // Because Route is related with Line,
    // when Route is deleted it should trigger an update in Line.

    const documentToDelete = await RouteModel.findOne({ _id: { $eq: req.query._id } });

    const deletedDocument = await RouteModel.findOneAndDelete({ _id: { $eq: req.query._id } });
    if (!deletedDocument) return await res.status(404).json({ message: `Route with _id: ${req.query._id} not found.` });

    for (const pattern_id of documentToDelete.patterns) {
      // Delete nested documents
      await PatternModel.findOneAndDelete({ _id: pattern_id });
    }

    const parentDocument = await LineModel.findOne({ _id: deletedDocument.parent_line });
    if (!parentDocument) return await res.status(404).json({ message: `Line with _id: ${deletedDocument.parent_line} not found.` });

    let validRouteIds = [];
    for (const route_id of parentDocument.routes) {
      const foundDocumentWithRouteId = await RouteModel.exists({ _id: route_id });
      if (foundDocumentWithRouteId) validRouteIds.push(route_id);
    }
    parentDocument.routes = validRouteIds;

    const editedParentDocument = await LineModel.findOneAndUpdate({ _id: parentDocument._id }, parentDocument, { new: true });
    if (!editedParentDocument) return await res.status(404).json({ message: `Line with _id: ${parentDocument._id} not found.` });

    return await res.status(200).send(deletedDocument);

    //
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  //
}
