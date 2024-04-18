/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
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

  // 4.
  // Ensure latest schema modifications are applied in the database.

  try {
    await PatternModel.syncIndexes();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // Update afetacao

  try {
    //

    const pickupTypesRaw = fs.readFileSync('/app/pages/api/configs/imports/pickupTypes_a3.txt', { encoding: 'utf8' });
    // const pickupTypesRaw = fs.readFileSync('./pages/api/configs/imports/pickupTypes_a3.txt', { encoding: 'utf8' });

    const parsedpickupTypes = Papa.parse(pickupTypesRaw, { header: true, delimiter: ',' });

    const doubleCheckThesePatterns = new Set();

    //

    // Retrieve all Patterns from database (only the code)
    const allPatternsSummaryData = await PatternModel.find({}, 'code');

    // Iterate through each available line
    for (const patternSummaryData of allPatternsSummaryData) {
      //

      // Skip if this pattern is not for the right area
      if (!patternSummaryData.code.startsWith('1')) continue;
      if (!patternSummaryData.code.startsWith('2')) continue;
      if (!patternSummaryData.code.startsWith('3')) continue;
      if (!patternSummaryData.code.startsWith('4')) continue;

      const patternData = await PatternModel.findOne({ code: patternSummaryData.code }).populate('path.stop');

      const afetacaoForThisPattern = parsedpickupTypes.data.filter((aft) => aft.trip_id.substring(0, 8) === patternData.code);
      if (!afetacaoForThisPattern) {
        console.error(`PATTERN NOT FOUND IN PICKUP_TYPES.CSV: ${patternData.code}`);
        continue;
      }

      for (const [pathIndex, pathData] of patternData.path.entries()) {
        //
        const matchingPathValues = afetacaoForThisPattern.find((st) => {
          return st.stop_id === pathData.stop.code && st.stop_sequence === String(pathIndex + 1);
        });

        if (!matchingPathValues || matchingPathValues?.pickup_type === '1' || matchingPathValues?.drop_off_type === '1') {
          doubleCheckThesePatterns.add(patternData.code);
        }

        patternData.path[pathIndex].allow_pickup = matchingPathValues?.pickup_type === '1' ? false : true;
        patternData.path[pathIndex].allow_drop_off = matchingPathValues?.drop_off_type === '1' ? false : true;

        //
      }

      await patternData.save();

      // Log progress
      console.log(`⤷ Updated pickup types for Pattern ${patternData?.code}`);

      //
    }

    console.log('Finished. Check these patterns:');
    console.table(Array.from(doubleCheckThesePatterns));

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
