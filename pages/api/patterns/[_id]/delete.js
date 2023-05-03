import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import { Model as PatternModel } from '../../../../schemas/Pattern/model';
import { Model as RouteModel } from '../../../../schemas/Route/model';

/* * */
/* DELETE PATTERN */
/* Explanation needed. */
/* * */

export default async function patternsDelete(req, res) {
  //
  await delay();

  // 0. Refuse request if not DELETE
  if (req.method != 'DELETE') {
    await res.setHeader('Allow', ['DELETE']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 2. Try to update the correct document
  try {
    //
    // Because Pattern is related with Route,
    // when Pattern is deleted it should trigger an update in Route.

    const deletedDocument = await PatternModel.findOneAndDelete({ _id: req.query._id });
    if (!deletedDocument) return await res.status(404).json({ message: `Pattern with _id: ${req.query._id} not found.` });

    const parentDocument = await RouteModel.findOne({ _id: deletedDocument.parent_route });
    if (!parentDocument) return await res.status(404).json({ message: `Route with _id: ${deletedDocument.parent_route} not found.` });

    let validPatternIds = [];
    for (const pattern_id of parentDocument.patterns) {
      const foundDocumentWithPatternId = await PatternModel.exists({ _id: pattern_id });
      if (foundDocumentWithPatternId) validPatternIds.push(pattern_id);
    }
    parentDocument.patterns = validPatternIds;

    const editedParentDocument = await RouteModel.findOneAndReplace({ _id: parentDocument._id }, parentDocument, { new: true });
    if (!editedParentDocument) return await res.status(404).json({ message: `Route with _id: ${parentDocument._id} not found.` });

    return await res.status(200).send(deletedDocument);

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot delete this Pattern.' });
  }

  //
}
