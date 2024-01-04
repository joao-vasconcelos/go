import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import generator from '@/services/generator';
import { CalendarDefault } from '@/schemas/Calendar/default';
import { CalendarModel } from '@/schemas/Calendar/model';

/* * */
/* CREATE CALENDAR */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  // 0.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'calendars', permission: 'create_edit', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 3.
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
}
