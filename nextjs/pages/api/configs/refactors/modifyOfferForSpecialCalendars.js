/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { PatternModel } from '@/schemas/Pattern/model';
import { CalendarModel } from '@/schemas/Calendar/model';

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
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
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

      // Do only for Area 2
      if (!patternCode.code.startsWith('4')) {
        console.log('this case', patternCode.code);
        continue patternLoop;
      }

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

        // Não tem dia 13 e é para adicionar. Adicionar ESP_CARNAVAL_DIA aos calendários_ON
        const hasCalendar7 = allCalendarsOnData.findIndex((c) => c.code === '7') >= 0;
        const hasCalendar38 = allCalendarsOnData.findIndex((c) => c.code === '38') >= 0;
        const hasCalendar102 = allCalendarsOnData.findIndex((c) => c.code === '102') >= 0;
        const hasCalendar100 = allCalendarsOnData.findIndex((c) => c.code === '100') >= 0;
        const hasCalendar111 = allCalendarsOnData.findIndex((c) => c.code === '111') >= 0;
        const hasCalendar183 = allCalendarsOnData.findIndex((c) => c.code === '183') >= 0;
        const hasCalendar8 = allCalendarsOnData.findIndex((c) => c.code === '8') >= 0;
        const hasCalendar11 = allCalendarsOnData.findIndex((c) => c.code === '11') >= 0;
        const hasCalendar115 = allCalendarsOnData.findIndex((c) => c.code === '115') >= 0;

        // Tem dia 13 e é para retirar. Adicionar ESP_CARNAVAL_DIA aos calendários_OFF
        const hasCalendar77 = allCalendarsOnData.findIndex((c) => c.code === '77') >= 0;
        const hasCalendar41 = allCalendarsOnData.findIndex((c) => c.code === '41') >= 0;
        const hasCalendar2 = allCalendarsOnData.findIndex((c) => c.code === '2') >= 0;
        const hasCalendar36 = allCalendarsOnData.findIndex((c) => c.code === '36') >= 0;
        const hasCalendar50 = allCalendarsOnData.findIndex((c) => c.code === '50') >= 0;
        const hasCalendar4 = allCalendarsOnData.findIndex((c) => c.code === '4') >= 0;
        const hasCalendar163 = allCalendarsOnData.findIndex((c) => c.code === '163') >= 0;
        const hasCalendar190 = allCalendarsOnData.findIndex((c) => c.code === '190') >= 0;
        const hasCalendar109 = allCalendarsOnData.findIndex((c) => c.code === '109') >= 0;
        const hasCalendar113 = allCalendarsOnData.findIndex((c) => c.code === '113') >= 0;

        /* * * * * * * * * */

        if (hasCalendar7 || hasCalendar38 || hasCalendar102 || hasCalendar100 || hasCalendar111 || hasCalendar183 || hasCalendar8 || hasCalendar11 || hasCalendar115) {
          addedCalendarsOn.add('ESP_CARNAVAL_DIA');
        }

        if (hasCalendar77 || hasCalendar41 || hasCalendar2 || hasCalendar36 || hasCalendar50 || hasCalendar4 || hasCalendar163 || hasCalendar190 || hasCalendar109 || hasCalendar113) {
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
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
