/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { StopModel, DeletedStopModel } from '@/schemas/Stop/model';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;
  let foundDocument;

  // 2.
  // Get session data

  try {
    sessionData = await getSession(req, res);
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'DELETE', session: sessionData, permissions: [{ scope: 'stops', action: 'view' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Fetch the correct document

  try {
    const foundAssociatedDocuments = await PatternModel.find({ 'path.stop': { $eq: req.query._id } }, '_id code headsign parent_route');
    if (foundAssociatedDocuments.length > 0) return await res.status(404).json({ message: 'Stop is still associated with Patterns.' });
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot fetch associated Patterns for this Stop.' });
  }

  // 5.
  // Retrieve requested document from the database

  try {
    foundDocument = await StopModel.findOne({ _id: { $eq: req.query._id } });
    if (!foundDocument) return await res.status(404).json({ message: `Stop with _id "${req.query._id}" not found.` });
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Stop not found.' });
  }

  // 6.
  // Check if document is locked

  if (foundDocument.is_locked) {
    return await res.status(423).json({ message: 'Stop is locked.' });
  }

  // 5.
  // Create this document in the Deleted Stops collection

  try {
    await DeletedStopModel({ code: foundDocument.code, name: foundDocument.name, latitude: foundDocument.latitude, longitude: foundDocument.longitude }).save();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Could not save this stop to the Deleted Stops collection.' });
  }

  // 6.
  // Delete the correct document

  try {
    const deletedDocument = await StopModel.findOneAndDelete({ _id: { $eq: req.query._id } });
    return await res.status(200).send(deletedDocument);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot delete this Stop.' });
  }

  //
}
