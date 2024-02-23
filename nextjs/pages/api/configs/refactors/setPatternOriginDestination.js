/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import routesOriginsDestinations from './routes-origins.json';
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
      const patternData = await PatternModel.findOne({ code: patternCode.code });

      const routeId = patternData.code.substring(0, 6);
      const patternDirection = patternData.code.substring(patternData.code.length - 1, patternData.code.length);

      //
      const routeOriginDestinationData = routesOriginsDestinations.find((p) => p.route_id === routeId);

      if (!routeOriginDestinationData) continue;

      if (patternDirection === '1') {
        patternData.origin = routeOriginDestinationData.origin;
        patternData.destination = routeOriginDestinationData.destination;
      } else if (patternDirection === '2') {
        patternData.destination = routeOriginDestinationData.origin;
        patternData.origin = routeOriginDestinationData.destination;
      } else if (patternDirection === '3') {
        patternData.destination = routeOriginDestinationData.origin;
        patternData.origin = routeOriginDestinationData.origin;
      }

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

  //
}
