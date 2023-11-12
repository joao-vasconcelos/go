/* * */

import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { CalendarModel } from '@/schemas/Calendar/model';

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
    for (const [index, calendarCode] of allCalendarCodes.entries()) {
      //

      const calendarData = await CalendarModel.findById(calendarCode._id);

      const possibleNumericCode = Number(calendarCode.code);

      if (isNaN(possibleNumericCode)) calendarData.numeric_code = index + 1000;
      else {
        const foundWithSameNumericCode = await CalendarModel.findOne({ numeric_code: possibleNumericCode });
        if (!foundWithSameNumericCode) calendarData.numeric_code = possibleNumericCode;
        else if (foundWithSameNumericCode.code === calendarData.code) calendarData.numeric_code = possibleNumericCode;
        else calendarData.numeric_code = index + 1000;
      }

      await calendarData.save();

      console.log(`Calendar Code: ${calendarData.code} -> Numeric code: ${calendarData.numeric_code}`);

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
