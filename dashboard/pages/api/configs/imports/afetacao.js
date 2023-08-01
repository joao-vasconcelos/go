import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import afetacaoData from '@/services/afetacao/afetacao_a4_parsed.json';
import { PatternModel } from '@/schemas/Pattern/model';
import { Model as StopModel } from '@/schemas/Stop/model';
import { Model as ZoneModel } from '@/schemas/Zone/model';

/* * */
/* IMPORT AFETACAO */
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
  // Ensure latest schema modifications are applied in the database.

  try {
    await PatternModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 6.
  // Update afetacao

  try {
    //

    // 6.1.
    // Retrieve all Patterns from database (only the code)
    const allPatternsSummaryData = await PatternModel.find({}, 'code');

    // 6.2.
    // Iterate through each available line
    for (const patternSummaryData of allPatternsSummaryData) {
      //

      // 6.2.0.
      // Skip if this pattern is not for the right area
      if (patternSummaryData.code.startsWith('1')) continue;
      if (patternSummaryData.code.startsWith('2')) continue;
      if (patternSummaryData.code.startsWith('3')) continue;
      //   if (patternSummaryData.code.startsWith('4')) continue;

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

      // 6.2.6.
      // Log progress
      console.log(`⤷ Updated afetacao for Pattern ${patternData?.code}`);

      //
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  // 7.
  // Log progress
  console.log('⤷ Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
