/* * */

import REALTIMEDB from '@/services/REALTIMEDB';
import checkAuthentication from '@/services/checkAuthentication';

/* * */

export default async function handler(req, res) {
  //

  // 0.
  // Refuse request if not POST

  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    console.log('before auth');
    await checkAuthentication({ scope: 'configs', permission: 'admin', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Connect to MongoDB

  try {
    await REALTIMEDB.connect();
    const testEvent = await REALTIMEDB.VehicleEvents.findOne({ _id: REALTIMEDB.toObjectId('63f3c6a1ed979d22848c296f') });
    console.log('testEvent', testEvent);
    return res.send({});
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 3.
  // List all documents

  try {
    const allDocuments = await AgencyModel.find();
    return await res.status(200).send(allDocuments);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Agencies.' });
  }

  //
}
