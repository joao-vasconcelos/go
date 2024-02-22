/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { DateModel } from '@/schemas/Date/model';

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
    await prepareApiEndpoint({ request: req, method: 'DELETE', session: sessionData, permissions: [{ scope: 'calendars', action: 'edit_dates' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare Endpoint.' });
  }

  // 4.
  // Delete the correct document

  try {
    const deletedDocument = await DateModel.findOneAndDelete({ _id: { $eq: req.query._id } });
    if (!deletedDocument) return await res.status(404).json({ message: `Date with _id: ${req.query._id} not found.` });
    return await res.status(200).send(deletedDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot delete this Date.' });
  }

  //
}
