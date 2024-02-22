/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { LineModel } from '@/schemas/Line/model';
import { TypologyModel } from '@/schemas/Typology/model';

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
    return await res.status(400).json({ message: err.message || 'Could not prepare Endpoint.' });
  }

  // 4.
  // Ensure latest schema modifications are applied in the database

  try {
    await LineModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // List all documents

  try {
    const allDocuments = await LineModel.find({ agency: { $in: sessionData.user.permissions.lines.view.fields.agencies } })
      .sort({ code: 1 })
      .populate('typology');
    return await res.status(200).send(allDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Lines.' });
  }

  //
}
