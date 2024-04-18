/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { PatternModel } from '@/schemas/Pattern/model';
import { DeletedStopModel, StopModel } from '@/schemas/Stop/model';
import { ZoneModel } from '@/schemas/Zone/model';
import Papa from 'papaparse';
import fs from 'fs';

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
    return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Ensure latest schema modifications are applied in the database.

  try {
    await PatternModel.syncIndexes();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // Update deletedStops

  try {
    //

    const deletedStopsRaw = fs.readFileSync('/app/pages/api/configs/imports/deleted_stop_ids.csv', { encoding: 'utf8' });
    // const deletedStopsRaw = fs.readFileSync('./pages/api/configs/imports/deleted_stop_ids.csv', { encoding: 'utf8' });

    const parsedDeletedStops = Papa.parse(deletedStopsRaw, { header: true, delimiter: ',' });

    // 5.2.
    // Iterate through each available line
    for (const deletedStopData of parsedDeletedStops.data) {
      //

      await DeletedStopModel({ code: deletedStopData.stop_id, name: deletedStopData.stop_name, latitude: deletedStopData.stop_lat, longitude: deletedStopData.stop_lon }).save();

      // 5.2.6.
      // Log progress
      console.log(`⤷ Updated deletedStop  ${deletedStopData?.stop_id}`);

      //
    }

    console.log('Finished. Check these patterns:');

    //
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Import Error' });
  }

  // 6.
  // Log progress
  console.log('⤷ Done. Sending response to client...');
  return await res.status(200).json('Import complete.');

  //
}
