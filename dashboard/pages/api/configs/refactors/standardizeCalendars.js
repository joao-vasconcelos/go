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

      // Skip if not A2
      if (!patternCode.code.startsWith('2')) continue;

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

        /* * * * * * * * * */

        //
        if (associatedCalendarCodes.has('P1_12')) {
          standardizedCalendars.add('CM_FER_DU');
          associatedCalendarCodes.delete('P1_12');
        }

        //
        if (associatedCalendarCodes.has('P2')) {
          standardizedCalendars.add('CM_FER_DU');
          associatedCalendarCodes.delete('P2');
        }

        //
        if (associatedCalendarCodes.has('P1_11')) {
          standardizedCalendars.add('CM_ESC_DU');
          associatedCalendarCodes.delete('P1_11');
        }

        //
        if (associatedCalendarCodes.has('DXQ1')) {
          standardizedCalendars.add('CM_VER_DU');
          associatedCalendarCodes.delete('DXQ1');
        }

        //
        if (associatedCalendarCodes.has('ML')) {
          standardizedCalendars.add('CM_ESC_DU');
          associatedCalendarCodes.delete('ML');
        }

        //
        if (associatedCalendarCodes.has('P1_32')) {
          standardizedCalendars.add('CM_FER_DOM');
          associatedCalendarCodes.delete('P1_32');
        }

        //
        if (associatedCalendarCodes.has('P0_9')) {
          standardizedCalendars.add('CM_VER_DOM');
          associatedCalendarCodes.delete('P0_9');
        }

        //
        if (associatedCalendarCodes.has('P1_31')) {
          standardizedCalendars.add('CM_ESC_DOM');
          associatedCalendarCodes.delete('P1_31');
        }

        //
        if (associatedCalendarCodes.has('P1_22')) {
          standardizedCalendars.add('CM_FER_SAB');
          associatedCalendarCodes.delete('P1_22');
        }

        //
        if (associatedCalendarCodes.has('P1_21')) {
          standardizedCalendars.add('CM_ESC_SAB');
          associatedCalendarCodes.delete('P1_21');
        }

        //
        if (associatedCalendarCodes.has('P1_23')) {
          standardizedCalendars.add('CM_VER_SAB');
          associatedCalendarCodes.delete('P1_23');
        }

        //
        if (associatedCalendarCodes.has('P1_1701')) {
          standardizedCalendars.add('CM_ESC_DOM');
          associatedCalendarCodes.delete('P1_1701');
        }

        //
        if (associatedCalendarCodes.has('P1_1103') && associatedCalendarCodes.has('P1_1203') && associatedCalendarCodes.has('P1_1303') && associatedCalendarCodes.has('P1_1403') && associatedCalendarCodes.has('P1_1503')) {
          standardizedCalendars.add('CM_VER_DU');
          associatedCalendarCodes.delete('P1_1103');
          associatedCalendarCodes.delete('P1_1203');
          associatedCalendarCodes.delete('P1_1303');
          associatedCalendarCodes.delete('P1_1403');
          associatedCalendarCodes.delete('P1_1503');
        }

        /* * * * * * * * * */

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
