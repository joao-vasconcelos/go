import delay from '../../../../services/delay';
import mongodb from '../../../../services/mongodb';
import { Model as LineModel } from '../../../../schemas/Line/model';
import { Model as RouteModel } from '../../../../schemas/Route/model';
import { Model as PatternModel } from '../../../../schemas/Pattern/model';

/* * */
/* DELETE LINE */
/* Explanation needed. */
/* * */

export default async function linesDelete(req, res) {
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
    const deletedLineDocument = await LineModel.findOneAndDelete({ _id: req.query._id });
    if (!deletedLineDocument) return await res.status(404).json({ message: `Line with _id: ${req.query._id} not found.` });
    // Delete Routes associated with this Line
    const routeDocumentsToDelete = await RouteModel.find({ parent_line: req.query._id });
    for (const routeToDelete of routeDocumentsToDelete) {
      // Delete Route document
      await RouteModel.findOneAndDelete({ _id: routeToDelete._id });
      // Delete Patterns associated with the deleted Route
      await PatternModel.deleteMany({ parent_route: routeToDelete._id });
    }
    return await res.status(200).send(deletedLineDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot delete this Line.' });
  }
}
