import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Model as CalendarModel } from '@/schemas/Calendar/model';

/* * */
/* IMPORT PATTERNS */
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
    // Fetch all Patterns from database
    const allCalendarCodes = await CalendarModel.find({}, 'code');

    // For each pattern
    for (const calendarCode of allCalendarCodes) {
      //

      if (calendarCode.code.startsWith('p3_')) {
        const calendarData = await CalendarModel.findOne({ code: calendarCode.code });
        const newCalendarCode = calendarCode.code.substring(3);

        if (await CalendarModel.exists({ code: newCalendarCode })) {
          console.log(`Trying to update calendar code ${calendarCode.code} to ${newCalendarCode} but it already exists`);
          continue;
        } else {
          calendarData.code = newCalendarCode;
          await calendarData.save();
          console.log(`Updated calendar code from ${calendarCode.code} to ${newCalendarCode}`);
        }
      }

      //
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
