import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */
/* MULTIPLY SHAPES */
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
    const allPatternCodes = await PatternModel.find({}, 'code');

    // For each pattern
    for (const patternCode of allPatternCodes) {
      //
      const pattern = await PatternModel.findOne({ code: patternCode.code });

      const isShapeInKm = pattern.shape.points[pattern.shape.points.length - 1].shape_dist_traveled / 1000;

      if (isShapeInKm < 1) {
        console.log('is in km', patternCode.code);
        // pattern.shape.points.forEach((element) => {
        //   return { ...element, shape_dist_traveled: element.shape_dist_traveled * 1000 };
        // });
      }

      //   await pattern.save();

      //
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Convert Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Convert complete.');
}
