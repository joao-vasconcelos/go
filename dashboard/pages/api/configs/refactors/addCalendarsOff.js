/* * */

import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { PatternModel } from '@/schemas/Pattern/model';
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
    const allPatternCodes = await PatternModel.find({}, 'code');

    // For each pattern
    for (const patternCode of allPatternCodes) {
      //

      // Do only for Area 4
      if (!patternCode.code.startsWith('4')) continue;

      // Fetch pattern data from database
      const patternData = await PatternModel.findOne({ code: patternCode.code });

      const newSchedulesForThisPattern = [];

      // For each schedule
      for (const scheduleData of patternData.schedules) {
        //

        // Transform the start time string to integer
        const scheduleStartTimeInt = parseInt(scheduleData.start_time.split(':').join(''));

        // Create a temporary variable
        const addedCalendarsOff = new Set();

        // For each calendar ON
        for (const calendarOnId of scheduleData.calendars_on) {
          //
          // Fetch calendar data from database
          const calendarOnData = await CalendarModel.findOne({ _id: calendarOnId });

          // VESPERA DE NATAL
          if (calendarOnData.dates.includes('20231224')) {
            if (scheduleStartTimeInt > 2159) {
              addedCalendarsOff.add('ESP_NATAL_VESP');
            }
          }

          // DIA DE NATAL
          if (calendarOnData.dates.includes('20231225')) {
            if (scheduleStartTimeInt < 730) {
              addedCalendarsOff.add('ESP_NATAL_DIA');
            }
          }

          // VESPERA DE ANO NOVO
          if (calendarOnData.dates.includes('20231231')) {
            const exceptionLines = new Set(['4512', '4513', '4600', '4602', '4603', '4604', '4701', '4703', '4707', '4715', '4725', '4730']);
            if (!exceptionLines.has(patternCode.code.substring(0, 4))) {
              if (scheduleStartTimeInt > 2159) {
                addedCalendarsOff.add('ESP_ANONOVO_VESP');
              }
            }
          }

          // DIA DE ANO NOVO
          if (calendarOnData.dates.includes('20240101')) {
            if (scheduleStartTimeInt < 730) {
              addedCalendarsOff.add('ESP_ANONOVO_DIA');
            }
          }

          //
        }

        if (addedCalendarsOff.size > 0) {
          for (const calendarOffCodeToAdd of [...addedCalendarsOff]) {
            const calendarOffData = await CalendarModel.findOne({ code: calendarOffCodeToAdd });
            if (calendarOffData?._id) {
              scheduleData.calendars_off.push(calendarOffData._id);
              console.log(`Added calendar OFF "${calendarOffData.code}"`);
            }
          }
        }

        newSchedulesForThisPattern.push(scheduleData);

        //
      }

      console.log('------------------------');

      patternData.schedules = newSchedulesForThisPattern;

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
