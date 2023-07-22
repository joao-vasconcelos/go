import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import patternVelocities from './patterns_velocities.json';
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
      if (!patternCode.code.startsWith('4')) continue;
      //
      const patternData = await PatternModel.findOne({ code: patternCode.code });

      //
      const presetVelocity = patternVelocities.find((p) => p.pattern_id === patternData.code);
      //
      const velocityToUpdate = presetVelocity.velocity ? presetVelocity.velocity : 20;

      //
      let updatedPath = [];

      // For each stop time in the path
      for (const path of patternData.path) {
        //
        updatedPath.push({
          ...path,
          default_velocity: velocityToUpdate,
          default_travel_time: calculateTravelTime(path.distance_delta, velocityToUpdate),
        });
        //
      }

      patternData.path = updatedPath;

      if (patternData?.presets?.velocity) patternData.presets.velocity = velocityToUpdate;
      else patternData.presets = { velocity: velocityToUpdate };

      await patternData.save();

      console.log(`Update pattern ${patternData.code} with velocity = ${velocityToUpdate} km/h`);

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
