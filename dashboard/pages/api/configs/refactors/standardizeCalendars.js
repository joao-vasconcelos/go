import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { PatternModel } from '@/schemas/Pattern/model';
import { CalendarModel } from '@/schemas/Calendar/model';

/* * */
/* REPEATED SCHEDULES */
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
    const allPatternCodes = await PatternModel.find({}, 'code');

    // For each pattern
    for (const patternCode of allPatternCodes) {
      //
      if (!patternCode.code.startsWith('1')) continue;
      //
      const patternData = await PatternModel.findOne({ code: patternCode.code });

      console.log(`Preparing pattern ${patternData.code} ...`);

      //

      let schedulesWithFinalCalendars = [];

      // For each stop time in the path
      for (const scheduleData of patternData.schedules) {
        //

        // Associated calendar codes

        let associatedCalendarCodes = new Set();

        for (const associatedCalendarId of scheduleData.calendars_on) {
          const associatedCalendarData = await CalendarModel.findOne({ _id: associatedCalendarId });
          associatedCalendarCodes.add(associatedCalendarData.code);
        }

        // Create variable to hold result

        let standardizedCalendars = new Set();

        //
        if (associatedCalendarCodes.has('A1_0_1')) {
          standardizedCalendars.add('CM_ESC_DU');
          associatedCalendarCodes.delete('A1_0_1');
        }

        //
        if (associatedCalendarCodes.has('P0_2')) {
          standardizedCalendars.add('CM_ESC_SAB');
          associatedCalendarCodes.delete('P0_2');
        }

        //
        if (associatedCalendarCodes.has('P0_3')) {
          standardizedCalendars.add('CM_ESC_DOM');
          associatedCalendarCodes.delete('P0_3');
        }

        //
        if (associatedCalendarCodes.has('8J') && associatedCalendarCodes.has('07')) {
          standardizedCalendars.add('CM_VER_DU');
          standardizedCalendars.add('CM_FER_DU');
          associatedCalendarCodes.delete('8J');
          associatedCalendarCodes.delete('07');
        }

        //
        if (associatedCalendarCodes.has('P0_8') && associatedCalendarCodes.has('P0_5A')) {
          standardizedCalendars.add('CM_VER_SAB');
          standardizedCalendars.add('CM_FER_SAB');
          associatedCalendarCodes.delete('P0_8');
          associatedCalendarCodes.delete('P0_5A');
        }

        //
        if (associatedCalendarCodes.has('UZ') && associatedCalendarCodes.has('ZR')) {
          standardizedCalendars.add('CM_VER_DOM');
          standardizedCalendars.add('CM_FER_DOM');
          associatedCalendarCodes.delete('UZ');
          associatedCalendarCodes.delete('ZR');
        }

        // Add remaining calendars
        for (const remainingCalendarCodes of associatedCalendarCodes.values()) {
          standardizedCalendars.add(remainingCalendarCodes);
        }

        let finalCalendarIdsForStandardizedCalendars = [];

        // Get calendars ids
        for (const standardizedCalendarCode of standardizedCalendars.values()) {
          const calendarData = await CalendarModel.findOne({ code: standardizedCalendarCode });
          finalCalendarIdsForStandardizedCalendars.push(calendarData._id);
        }

        // console.log('finalCalendarIdsForStandardizedCalendars', finalCalendarIdsForStandardizedCalendars);

        schedulesWithFinalCalendars.push({ ...scheduleData, calendars_on: finalCalendarIdsForStandardizedCalendars });

        //
      }

      patternData.schedules = schedulesWithFinalCalendars;

      console.log('------------------------');

      await patternData.save();

      console.log(`Updated pattern ${patternData.code}`);

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
