import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */
/* IMPORT PATTERNS */
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
    patternLoop: for (const patternCode of allPatternCodes) {
      //
      const patternData = await PatternModel.findOne({ code: patternCode.code });

      // CHECK IF ALL TRAVEL TIMES ARE 20 km/h
      let allVelocitiesAreEqualTo20 = true;
      pathLoop: for (const [pathIndex, pathData] of patternData.path.entries()) {
        if (pathIndex === 0) continue pathLoop;
        if (pathData.default_velocity === 20) allVelocitiesAreEqualTo20 = true;
        else allVelocitiesAreEqualTo20 = false;
      }

      if (allVelocitiesAreEqualTo20) continue patternLoop;

      let updatedPath = [];
      // For each stop time in the path
      for (const path of patternData.path) {
        updatedPath.push({
          ...path,
          default_travel_time: path.default_travel_time * 3600,
        });
      }

      patternData.path = updatedPath;

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
