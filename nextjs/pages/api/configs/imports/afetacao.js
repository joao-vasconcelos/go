/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import afetacaoData from '@/services/afetacao/afetacao_a1_parsed.json';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
import { ZoneModel } from '@/schemas/Zone/model';

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

  // 4.
  // Ensure latest schema modifications are applied in the database.

  try {
    await PatternModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // Update afetacao

  try {
    //

    // 5.1.
    // Retrieve all Patterns from database (only the code)
    const allPatternsSummaryData = await PatternModel.find({}, 'code');

    // 5.2.
    // Iterate through each available line
    for (const patternSummaryData of allPatternsSummaryData) {
      //

      // 5.2.0.
      // Skip if this pattern is not for the right area
      //   if (patternSummaryData.code.startsWith('1')) continue;
      if (patternSummaryData.code.startsWith('2')) continue;
      if (patternSummaryData.code.startsWith('3')) continue;
      if (patternSummaryData.code.startsWith('4')) continue;

      const patternData = await PatternModel.findOne({ code: patternSummaryData.code }).populate('path.stop');

      const afetacaoForThisPattern = afetacaoData[patternData.code];
      if (!afetacaoForThisPattern) continue;

      for (const [pathIndex, pathData] of patternData.path.entries()) {
        //
        const matchingPathValues = afetacaoForThisPattern.find((item) => {
          return item.stop_id === pathData.stop.code && item.stop_sequence === String(pathIndex + 1);
        });

        if (!matchingPathValues?.zones?.length) continue;

        let zoneIdsForThisPathSegment = [];
        for (const zoneCode of matchingPathValues.zones) {
          const zoneData = await ZoneModel.findOne({ code: zoneCode });
          if (zoneData) zoneIdsForThisPathSegment.push(zoneData._id);
        }

        if (zoneIdsForThisPathSegment.length) {
          patternData.path[pathIndex].zones = zoneIdsForThisPathSegment;
        }

        //
      }

      await patternData.save();

      // 5.2.6.
      // Log progress
      console.log(`⤷ Updated afetacao for Pattern ${patternData?.code}`);

      //
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  // 6.
  // Log progress
  console.log('⤷ Done. Sending response to client...');
  return await res.status(200).json('Import complete.');

  //
}
