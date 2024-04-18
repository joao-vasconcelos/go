/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { CalendarModel } from '@/schemas/Calendar/model';

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
    return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'calendars', action: 'view' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Ensure latest schema modifications are applied in the database

  try {
    await CalendarModel.syncIndexes();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // List all documents

  try {
    const allDocuments = await CalendarModel.find();
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    const sortedDocuments = allDocuments.sort((a, b) => collator.compare(a.name, b.name));
    return await res.status(200).send(sortedDocuments);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot list Calendars.' });
  }

  //
}
