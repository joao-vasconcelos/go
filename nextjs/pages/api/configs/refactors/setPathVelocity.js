/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import patternVelocities from './patterns_velocities.json';
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
      if (!patternCode.code.startsWith('4')) continue;
      //
      const patternData = await PatternModel.findOne({ code: patternCode.code });

      //
      const presetVelocity = patternVelocities.find((p) => p.pattern_id === patternData.code);
      //
      const velocityToUpdate = presetVelocity?.velocity ? presetVelocity.velocity : 20;

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
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');

  //
}

/* * */

function calculateTravelTime(distanceInMeters, speedInKmPerHour) {
  if (speedInKmPerHour === 0 || distanceInMeters === 0) {
    return 0;
  }
  const speedInMetersPerSecond = (speedInKmPerHour * 1000) / 3600;
  const travelTimeInSeconds = parseInt(distanceInMeters / speedInMetersPerSecond);
  return travelTimeInSeconds || 0;
}
