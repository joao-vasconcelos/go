import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { PatternModel } from '@/schemas/Pattern/model';

/* * */
/* GET PATTERNS BY CALENDAR */
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
    await checkAuthentication({ scope: 'lines', permission: 'view', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 3.
  // Fetch the correct document

  try {
    const foundDocuments = await PatternModel.find({ 'schedules.calendars_on': { $eq: req.query._id } });
    console.log(foundDocuments);
    return await res.status(200).json(foundDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch associated Patterns for this Calendar.' });
  }
}
