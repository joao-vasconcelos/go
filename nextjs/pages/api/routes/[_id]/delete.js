/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { RouteModel } from '@/schemas/Route/model';
import { LineModel } from '@/schemas/Line/model';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;

  // 2.
  // Get session data

  try {
    sessionData = await getSession(req, res);
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'DELETE', session: sessionData, permissions: [{ scope: 'lines', action: 'delete' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 3.
  // Delete the requested document

  try {
    //
    // Because Route is related with Line,
    // when Route is deleted it should trigger an update in Line.

    const documentToDelete = await RouteModel.findOne({ _id: { $eq: req.query._id } });

    const deletedDocument = await RouteModel.findOneAndDelete({ _id: { $eq: req.query._id } });
    if (!deletedDocument) return await res.status(404).json({ message: `Route with _id "${req.query._id}" not found.` });

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
  } catch (error) {
    console.log(error);
    return await res.status(409).json({ message: err.message });
  }

  //
}
