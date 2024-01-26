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
    operationDayEndMilis = DateTime.fromFormat(req.body.operation_day, 'yyyyMMdd').setZone('Europe/Lisbon').plus({ days: 1 }).startOf('day').set({ hour: 3, minute: 59 }).toMillis();
    //
    // /* TEST */ operationDayEndMilis = DateTime.fromFormat(req.body.operation_day, 'yyyyMMdd').setZone('Europe/Lisbon').startOf('day').set({ hour: 5, minute: 0 }).toMillis();
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
    const aggregationPipeline = [
      {
        $match: {
          //   'millis.$numberLong': {
          millis: {
            $gte: operationDayStartMilis,
            $lte: operationDayEndMilis,
          },
          'content.entity.vehicle.agencyId': req.body.agency_code,
          'content.entity.vehicle.trip.tripId': { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$content.entity.vehicle.trip.tripId',
          trip_id: { $first: '$content.entity.vehicle.trip.tripId' },
          line_id: { $first: '$content.entity.vehicle.trip.lineId' },
          route_id: { $first: '$content.entity.vehicle.trip.routeId' },
          pattern_id: { $first: '$content.entity.vehicle.trip.patternId' },
          num_events: { $sum: 1 },
          vehicle_id: { $addToSet: '$content.entity.vehicle.vehicle._id' },
          driver_id: { $addToSet: '$content.entity.vehicle.vehicle.driverId' },
          positions: {
            $push: {
              timestamp: '$content.entity.vehicle.timestamp',
              lat: '$content.entity.vehicle.position.latitude',
              lon: '$content.entity.vehicle.position.longitude',
            },
          },
        },
      },
      {
        $project: {
          trip_id: { $first: '$trip_id' },
          line_id: { $first: '$line_id' },
          route_id: { $first: '$route_id' },
          pattern_id: { $first: '$pattern_id' },
          positions: {
            $map: {
              input: '$positions',
              as: 'position',
              in: {
                timestamp: { $first: '$$position.timestamp' },
                lat: { $first: '$$position.lat' },
                lon: { $first: '$$position.lon' },
              },
            },
          },
          num_events: 1,
          vehicle_id: 1,
          driver_id: 1,
          _id: 0,
        },
      },
    ];
    console.log('Finding events...');
    const allMatchingEventsCursor = REALTIMEDB.VehicleEvents.aggregate(aggregationPipeline, { allowDiskUse: true });
    console.log('Streaming events...');
    await allMatchingEventsCursor.stream().pipe(JSONStream.stringify()).pipe(res);
    console.log('Done streaming events.');
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list VehicleEvents.' });
  }

  // 5.
  // Fetch matching events

  //   try {
  //     console.log('Finding events...');
  //     const allMatchingEventsCursor = REALTIMEDB.VehicleEvents.find({ 'content.entity.vehicle.agencyId': req.body.agency_code, millis: { $gte: operationDayStartMilis, $lte: operationDayEndMilis } });
  //     console.log('Streaming events...');
  //     await allMatchingEventsCursor
  //       .stream({
  //         transform: (doc) => {
  //           if (!doc.content.entity[0].vehicle?.trip?.tripId) return;
  //           return {
  //             _id: doc._id,
  //             millis: doc.millis,
  //             line_id: doc.content.entity[0].vehicle.trip.lineId,
  //             route_id: doc.content.entity[0].vehicle.trip.routeId,
  //             pattern_id: doc.content.entity[0].vehicle.trip.patternId,
  //             trip_id: doc.content.entity[0].vehicle.trip.tripId,
  //             stop_id: doc.content.entity[0].vehicle.stopId,
  //             vehicle_id: doc.content.entity[0].vehicle.vehicle._id,
  //             driver_id: doc.content.entity[0].vehicle.vehicle.driverId,
  //             operator_event_id: doc.content.entity[0]._id,
  //             operation_plan_id: doc.content.entity[0].vehicle.operationPlanId,
  //           };
  //         },
  //       })
  //       .pipe(JSONStream.stringify())
  //       .pipe(res);
  //     console.log('Done streaming events.');
  //   } catch (err) {
  //     console.log(err);
  //     return await res.status(500).json({ message: 'Cannot list VehicleEvents.' });
  //   }

  //
}
