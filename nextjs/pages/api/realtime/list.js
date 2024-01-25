/* * */

import { DateTime } from 'luxon';
import JSONStream from 'JSONStream';
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
    await checkAuthentication({ scope: 'configs', permission: 'admin', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 3.
  // Prepare datetime variables

  let operationDayStartMilis;
  let operationDayEndMilis;

  try {
    operationDayStartMilis = DateTime.fromFormat(req.body.operation_day, 'yyyyMMdd').setZone('Europe/Lisbon').startOf('day').set({ hour: 4, minute: 0 }).toMillis();
    operationDayEndMilis = DateTime.fromFormat(req.body.operation_day, 'yyyyMMdd').setZone('Europe/Lisbon').startOf('day').set({ hour: 5, minute: 0 }).toMillis();
    // operationDayEndMilis = DateTime.fromFormat(req.body.operation_day, 'yyyyMMdd').setZone('Europe/Lisbon').plus({ days: 1 }).startOf('day').set({ hour: 3, minute: 59 }).toMillis();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Error converting date boundaries to miliseconds.' });
  }

  // 4.
  // Connect to REALTIMEDB

  try {
    await REALTIMEDB.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not connect to REALTIMEDB.' });
  }

  // 5.
  // Fetch matching events

  try {
    console.log('Finding events...');
    const allMatchingEventsCursor = REALTIMEDB.VehicleEvents.find({ 'content.entity.vehicle.agencyId': req.body.agency_code, millis: { $gte: operationDayStartMilis, $lte: operationDayEndMilis } });
    console.log('Streaming events...');
    await allMatchingEventsCursor.stream().pipe(JSONStream.stringify()).pipe(res);
    console.log('Done streaming events.');
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list VehicleEvents.' });
  }

  //
}
