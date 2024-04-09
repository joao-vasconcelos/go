/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { PatternModel } from '@/schemas/Pattern/model';
import { RouteModel } from '@/schemas/Route/model';

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

    const allPatternsIds = await PatternModel.find({}, '_id code parent_route');

    for (const patternId of allPatternsIds) {
      //
      console.log(`Preparing pattern ${patternId.code} ...`);

      const parentRouteData = await RouteModel.findOne({ _id: patternId.parent_route });

      if (!parentRouteData) console.log(`MAJOR ERROR: pattern_id: ${patternId.code} pattern_code: ${patternId.code} route_id: ${patternId.parent_route}`);

      patternId.parent_line = parentRouteData?.parent_line;

      await patternId.save();

      console.log(`Updated pattern ${patternId.code}`);
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
