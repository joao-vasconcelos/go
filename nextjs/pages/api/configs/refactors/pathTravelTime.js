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
