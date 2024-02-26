/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
import { ZoneModel } from '@/schemas/Zone/model';
import Papa from 'papaparse';
import fs from 'fs';

/* * */

export default async function handler(req, res) {
  //

  //   throw new Error('Feature is disabled.');

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

    const afetacaoRaw = fs.readFileSync('/app/pages/api/configs/refactors/afetacao_a3.csv', { encoding: 'utf8' });

    const parsedAfetacao = Papa.parse(afetacaoRaw, { header: true, delimiter: ';' });

    const doubleCheckThesePatterns = new Set();

    const amlZoneData = await ZoneModel.findOne({ code: 'id-zone-multi-aml' });

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
      if (!patternSummaryData.code.startsWith('3')) continue;
      //   if (!patternSummaryData.code.startsWith('1')) continue;
      //   if (!patternSummaryData.code.startsWith('2')) continue;
      //   if (!patternSummaryData.code.startsWith('4')) continue;

      const patternData = await PatternModel.findOne({ code: patternSummaryData.code }).populate('path.stop');

      const afetacaoForThisPattern = parsedAfetacao.data.filter((aft) => aft.pattern_id === patternData.code);
      if (!afetacaoForThisPattern) {
        console.error(`PATTERN NOT FOUND IN AFETACAO.CSV: ${patternData.code}`);
        continue;
      }

      for (const [pathIndex, pathData] of patternData.path.entries()) {
        //
        const matchingPathValues = afetacaoForThisPattern.find((aft) => {
          const fixedStopId = aft.stop_id.length < 6 ? `0${aft.stop_id}` : aft.stop_id;
          return fixedStopId === pathData.stop.code; //&& aft.stop_sequence === String(pathIndex + 1);
        });

        const zonesForThisStop = matchingPathValues?.zones.split('-');
        if (!zonesForThisStop?.length) {
          console.error(`No match for pattern_id: "${patternData.code}" | stop_sequence: "${pathIndex + 1}" | stop_id: "${pathData.stop.code}"`);
          doubleCheckThesePatterns.add(patternData.code);
          continue;
        }

        let zoneIdsForThisPathSegment = new Set();
        for (const zoneName of zonesForThisStop) {
          const zoneData = await ZoneModel.findOne({ name: zoneName });
          if (zoneData) zoneIdsForThisPathSegment.add(zoneData._id);
        }

        zoneIdsForThisPathSegment.add(amlZoneData._id);

        if (zoneIdsForThisPathSegment.size) {
          patternData.path[pathIndex].zones = Array.from(zoneIdsForThisPathSegment);
        }

        //
      }

      await patternData.save();

      // 5.2.6.
      // Log progress
      console.log(`⤷ Updated afetacao for Pattern ${patternData?.code}`);

      //
    }

    console.log('Finished. Check these patterns:');
    console.table(Array.from(doubleCheckThesePatterns));

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
