/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import generator from '@/services/generator';
import { CalendarDefault } from '@/schemas/Calendar/default';
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
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'calendars', action: 'create' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Save a new document with req.body

  try {
    const newDocument = { ...CalendarDefault, code: generator({ length: 5 }), numeric_code: generator({ length: 5, type: 'numeric' }) };
    while (await CalendarModel.exists({ $or: [{ code: newDocument.code }, { numeric_code: newDocument.numeric_code }] })) {
      newDocument.code = generator({ length: 5 });
      newDocument.numeric_code = generator({ length: 5, type: 'numeric' });
    }
    const createdDocument = await CalendarModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this Calendar.' });
  }

  //
}
