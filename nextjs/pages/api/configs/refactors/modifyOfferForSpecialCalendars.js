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
    patternLoop: for (const patternCode of allPatternCodes) {
      //

      // Do only for Area 1
      if (!patternCode.code.startsWith('3')) continue patternLoop;

      // Fetch pattern data from database
      const patternData = await PatternModel.findOne({ code: patternCode.code });

      const newSchedulesForThisPattern = [];

      // For each schedule
      scheduleLoop: for (const scheduleData of patternData.schedules) {
        //

        // Transform the start time string to integer
        // const scheduleStartTimeInt = parseInt(scheduleData.start_time.split(':').join(''));

        // Create a temporary variable
        const addedCalendarsOn = new Set();
        const addedCalendarsOff = new Set();

        // Get info for each associated calendar_on of this schedule
        const allCalendarsOnData = [];
        for (const calendarOnId of scheduleData.calendars_on) {
          // Fetch calendar data from database
          const calendarOnData = await CalendarModel.findOne({ _id: calendarOnId });
          allCalendarsOnData.push(calendarOnData);
        }

        // Get info for each associated calendar_off of this schedule
        const allCalendarsOffData = [];
        for (const calendarOffId of scheduleData.calendars_off) {
          // Fetch calendar data from database
          const calendarOffData = await CalendarModel.findOne({ _id: calendarOffId });
          allCalendarsOffData.push(calendarOffData);
        }

        // Check if this schedule has the following calendars
        const hasCalendarFerSab = allCalendarsOnData.findIndex((c) => c.code === 'FER_SAB') >= 0;
        const hasCalendarFerDu = allCalendarsOnData.findIndex((c) => c.code === 'FER_DU') >= 0;

        /* * * * * * * * * */

        if (hasCalendarFerSab && hasCalendarFerDu) {
          continue scheduleLoop;
        }

        if (hasCalendarFerSab && !hasCalendarFerDu) {
          addedCalendarsOn.add('ESP_CARNAVAL_DIA');
        }

        if (!hasCalendarFerSab && hasCalendarFerDu) {
          addedCalendarsOff.add('ESP_CARNAVAL_DIA');
        }

        /* * * * * * * * * */

        if (addedCalendarsOn.size > 0) {
          // Apply the new rules
          for (const calendarOnCodeToAdd of [...addedCalendarsOn]) {
            const calendarOnData = await CalendarModel.findOne({ code: calendarOnCodeToAdd });
            if (calendarOnData?._id) {
              scheduleData.calendars_on.push(calendarOnData._id);
              console.log(`pattern.code: ${patternCode.code} | schedule.start_time: ${scheduleData.start_time} | Added calendar ON "${calendarOnData.code}"`);
            }
          }
        }

        if (addedCalendarsOff.size > 0) {
          // Apply the new rules
          for (const calendarOffCodeToAdd of [...addedCalendarsOff]) {
            const calendarOffData = await CalendarModel.findOne({ code: calendarOffCodeToAdd });
            if (calendarOffData?._id) {
              scheduleData.calendars_off.push(calendarOffData._id);
              console.log(`pattern.code: ${patternCode.code} | schedule.start_time: ${scheduleData.start_time} | Added calendar OFF "${calendarOffData.code}"`);
            }
          }
        }

        newSchedulesForThisPattern.push(scheduleData);

        //
      }

      console.log('------------------------');

      patternData.schedules = newSchedulesForThisPattern;

      await PatternModel.findOneAndReplace({ _id: patternData._id }, patternData, { new: true });

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
