/* * */

import { PatternModel } from '@/schemas/Pattern/model';
import { CalendarModel } from '@/schemas/Calendar/model';
import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

/* * */

export default async function handler(req, res) {
  //

  throw new Error('Feature is disabled.');

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
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
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
      if (!patternCode.code.startsWith('4')) continue patternsLoop;

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

        if (associatedCalendarCodes.has('15')) {
          console.log('Found calendar "15"');
          associatedCalendarCodes.delete('15');
          associatedCalendarCodes.add('ESC_DU');
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
