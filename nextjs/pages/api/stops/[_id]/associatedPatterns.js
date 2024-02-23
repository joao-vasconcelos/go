/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
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
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'lines', action: 'view' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 3.
  // Fetch the correct document

  try {
    const foundDocuments = await PatternModel.find({ 'path.stop': { $eq: req.query._id } }, '_id code headsign parent_route');
    return await res.status(200).json(foundDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch associated Patterns for this Stop.' });
  }
}
