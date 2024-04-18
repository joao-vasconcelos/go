/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { PatternModel } from '@/schemas/Pattern/model';

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
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
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
      //   if (patternCode.code !== '2151_0_1') continue;
      //
      const patternData = await PatternModel.findOne({ code: patternCode.code });

      console.log('------------------------');

      console.log('code', patternData.code);

      console.log('before', patternData.schedules.length);

      //
      let deduplicatedSchedules = [];

      // For each stop time in the path
      for (const schedule of patternData.schedules) {
        //
        const alreadyDeduplicated = deduplicatedSchedules.find((item) => item.start_time === schedule.start_time);
        //
        if (alreadyDeduplicated) {
          alreadyDeduplicated.calendars_on = [...alreadyDeduplicated.calendars_on, schedule.calendars_on];
        } else {
          //
          deduplicatedSchedules.push(schedule);
        }
        //
      }

      patternData.schedules = deduplicatedSchedules;

      console.log('after', patternData.schedules.length);

      console.log('------------------------');

      await patternData.save();

      console.log(`Update pattern ${patternData.code}`);

      //
    }

    //
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');

  //
}
