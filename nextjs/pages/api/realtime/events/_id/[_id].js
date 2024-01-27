/* * */

import { DateTime } from 'luxon';
import JSONStream from 'JSONStream';
import REALTIMEDB from '@/services/REALTIMEDB';
import checkAuthentication from '@/services/checkAuthentication';

/* * */

export const config = { api: { responseLimit: false } };

/* * */

export default async function handler(req, res) {
  //

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

  // 2.
  // Connect to REALTIMEDB

  try {
    await REALTIMEDB.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not connect to REALTIMEDB.' });
  }

  // 3.
  // Perform database search

  try {
    const foundDocument = await REALTIMEDB.VehicleEvents.findOne({ _id: { $eq: REALTIMEDB.toObjectId(req.query._id) } });
    return await res.status(200).json(foundDocument);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list VehicleEvents.' });
  }

  //
}
