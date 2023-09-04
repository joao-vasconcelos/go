import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { CalendarModel } from '@/schemas/Calendar/model';

/* * */
/* LIST ALL CALENDARS */
/* This endpoint returns all calendars. */
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
    await checkAuthentication({ scope: 'calendars', permission: 'view', req, res });
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
  // List all documents

  try {
    const allDocuments = await CalendarModel.find();
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    const sortedDocuments = allDocuments.sort((a, b) => collator.compare(a.name, b.name));
    return await res.status(200).send(sortedDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Calendars.' });
  }
}
