import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */
/* IMPORT PATTERN SHAPES */
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
    const allPatterns = await PatternModel.find({}, 'code');

    // Get route info for each line
    for (const patternDoc of allPatterns) {
      //
      // Skip if not A1
      // if (!route.code.startsWith('2')) continue;
      //   if (parseInt(route.code.substring(0, 4)) < 1616) continue;

      try {
        //

        const pattern = await PatternModel.findOne({ code: patternDoc.code });

        // Get info for the Pattern from API v1
        const response = await fetch(`https://api.carrismetropolitana.pt/patterns/${pattern.code}`);
        const responseData = await response.json();

        //
        pattern.shape = { extension: responseData.shape.extension, points: responseData.shape.points, geojson: responseData.shape.geojson };
        //

        await pattern.save();

        //
      } catch (error) {
        console.log('Did not import pattern', patternDoc.code, error);
      }

      //

      await delay(250); // 250 miliseconds of delay
      //
    }
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
