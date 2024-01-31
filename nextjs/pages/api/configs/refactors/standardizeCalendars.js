/* * */

import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { PatternModel } from '@/schemas/Pattern/model';
import { CalendarModel } from '@/schemas/Calendar/model';

/* * */

export default async function handler(req, res) {
  //

  //   throw new Error('Feature is disabled.');

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
    patternsLoop: for (const patternCode of allPatternCodes) {
      //

      // Skip if not A1
      if (!patternCode.code.startsWith('1')) continue patternsLoop;

      //

      const patternData = await PatternModel.findOne({ code: patternCode.code });

      console.log(`Preparing pattern ${patternData.code} ...`);

      //

      let schedulesWithFinalCalendars = [];

      // For each stop time in the path
      schedulesLoop: for (const scheduleData of patternData.schedules) {
        //

        // Associated calendar codes

        let associatedCalendarCodes = new Set();

        for (const associatedCalendarId of scheduleData.calendars_on) {
          const associatedCalendarData = await CalendarModel.findOne({ _id: associatedCalendarId });
          associatedCalendarCodes.add(associatedCalendarData.code);
        }

        /* * * * * * * * * */

        if (associatedCalendarCodes.has('ZR')) {
          console.log('Found calendar "ZR"');
          associatedCalendarCodes.delete('ZR');
        }

        if (associatedCalendarCodes.has('P0_5A')) {
          console.log('Found calendar "P0_5A"');
          associatedCalendarCodes.delete('P0_5A');
        }

        if (associatedCalendarCodes.has('07')) {
          console.log('Found calendar "07"');
          associatedCalendarCodes.delete('07');
        }

        if (associatedCalendarCodes.has('8J')) {
          console.log('Found calendar "8J"');
          associatedCalendarCodes.delete('8J');
          associatedCalendarCodes.add('VER_DU');
          associatedCalendarCodes.add('FER_DU_1ASEMSET');
        }

        if (associatedCalendarCodes.has('UZ')) {
          console.log('Found calendar "UZ"');
          associatedCalendarCodes.delete('UZ');
          associatedCalendarCodes.add('VER_DOM');
          associatedCalendarCodes.add('FER_DOM_1ASEMSET');
        }

        if (associatedCalendarCodes.has('P0_8')) {
          console.log('Found calendar "P0_8"');
          associatedCalendarCodes.delete('P0_8');
          associatedCalendarCodes.add('VER_SAB');
          associatedCalendarCodes.add('FER_SAB_1ASEMSET');
        }

        /* * * * * * * * * */

        let finalCalendarIdsForStandardizedCalendars = [];

        // Get calendars ids
        for (const standardizedCalendarCode of associatedCalendarCodes.values()) {
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

  //
}
