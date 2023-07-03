import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Model as CalendarModel } from '@/schemas/Calendar/model';

/* * */
/* IMPORT LINES */
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
    await checkAuthentication({ scope: 'configs', permission: 'admin', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 4.
  // Connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Connect to mongodb

  try {
    //
    // Get info for all Calendars from API v2
    const result = await CalendarModel.deleteMany();
    console.log(`Deleted Calendars: ${result.deletedCount}`);

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Delete Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Delete complete.');
}
