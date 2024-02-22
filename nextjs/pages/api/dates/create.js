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
    await prepareApiEndpoint({ request: req, method: 'POST', session: sessionData, permissions: [{ scope: 'calendars', action: 'edit_dates' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 5.
  // Save new documents from req.body

  try {
    let createdDocuments = [];
    for (const dateObject of req.body) {
      const createdDocument = await DateModel.findOneAndUpdate({ date: dateObject.date }, dateObject, { new: true, upsert: true });
      createdDocuments.push(createdDocument);
    }
    return await res.status(201).json(createdDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Date.' });
  }

  //
}
