import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import generate from '@/services/generator';
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
    for (const patternCode of allPatternCodes) {
      //
      const pattern = await PatternModel.findOne({ code: patternCode.code });

      let updatedPath = [];
      // For each stop time in the path
      for (const path of pattern.path) {
        //
        updatedPath.push({
          ...path,
          default_travel_time: calculateTravelTime(path.distance_delta, path.default_velocity),
        });
        //
      }

      pattern.path = updatedPath;

      await pattern.save();

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

//
//
//

function calculateTravelTime(distanceInMeters, speedInKmPerHour) {
  if (speedInKmPerHour === 0 || distanceInMeters === 0) {
    return 0;
  }
  const speedInMetersPerSecond = (speedInKmPerHour * 1000) / 3600;
  const travelTimeInSeconds = parseInt(distanceInMeters / speedInMetersPerSecond);
  return travelTimeInSeconds || 0;
}
