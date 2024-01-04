import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */
/* REPEATED SCHEDULES */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  throw new Error('Feature is disabled.');

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
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
