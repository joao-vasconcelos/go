/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import PCGIDB from '@/services/PCGIDB';
import JSONStream from 'JSONStream';
import { DateTime } from 'luxon';

/* * */

export const config = { api: { responseLimit: false } };

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;

	// 2.
	// Get session data

	try {
		sessionData = await getSession(req, res);
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ request: req, method: 'POST', session: sessionData, permissions: [{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['realtime'] }] }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Parse request body into JSON

	try {
		req.body = await JSON.parse(req.body);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'JSON parse error.' });
	}

	// 5.
	// Prepare datetime variables

	let operationDayStartMilis;
	let operationDayEndMilis;

	try {
		operationDayStartMilis = DateTime.fromFormat(req.body.operation_day, 'yyyyMMdd').setZone('Europe/Lisbon').startOf('day').set({ hour: 4, minute: 0, second: 0 }).toMillis();
		operationDayEndMilis = DateTime.fromFormat(req.body.operation_day, 'yyyyMMdd').setZone('Europe/Lisbon').plus({ days: 1 }).startOf('day').set({ hour: 3, minute: 59, second: 59 }).toMillis();
		//
		// /* TEST */ operationDayEndMilis = DateTime.fromFormat(req.body.operation_day, 'yyyyMMdd').setZone('Europe/Lisbon').startOf('day').set({ hour: 5, minute: 0, second: 0 }).toMillis();
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Error converting date boundaries to miliseconds.' });
	}

	// 6.
	// Connect to PCGIDB

	try {
		await PCGIDB.connect();
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Could not connect to PCGIDB.' });
	}

	// 7.
	// Prepare aggregation pipeline

	const matchClause = {
		$match: {
			$and: [
				{
					millis: { $gte: operationDayStartMilis, $lte: operationDayEndMilis },
					$and: [
						{
							'content.entity.vehicle.agencyId': req.body.agency_code,
							$and: [
								{
									'content.entity.vehicle.trip.tripId': { $exists: true, $ne: null },
								},
							],
						},
					],
				},
			],
		},
	};

	const groupClause = {
		$group: {
			_id: '$content.entity.vehicle.trip.tripId',
			trip_id: { $first: '$content.entity.vehicle.trip.tripId' },
			line_id: { $first: '$content.entity.vehicle.trip.lineId' },
			route_id: { $first: '$content.entity.vehicle.trip.routeId' },
			pattern_id: { $first: '$content.entity.vehicle.trip.patternId' },
			vehicle_id: { $addToSet: '$content.entity.vehicle.vehicle._id' },
			driver_id: { $addToSet: '$content.entity.vehicle.vehicle.driverId' },
			num_events: { $sum: 1 },
			positions: {
				$push: {
					tml_event_id: '$_id',
					operator_event_id: '$content.entity._id',
					insert_timestamp: '$millis',
					header_timestamp: '$content.header.timestamp',
					vehicle_timestamp: '$content.entity.vehicle.timestamp',
					odometer: '$content.entity.vehicle.position.odometer',
					lat: '$content.entity.vehicle.position.latitude',
					lon: '$content.entity.vehicle.position.longitude',
					stop_id: '$content.entity.vehicle.stopId',
				},
			},
		},
	};

	const projectClause = {
		$project: {
			_id: 0,
			trip_id: { $first: '$trip_id' },
			line_id: { $first: '$line_id' },
			route_id: { $first: '$route_id' },
			pattern_id: { $first: '$pattern_id' },
			vehicle_id: 1,
			driver_id: 1,
			num_events: 1,
			positions: {
				$map: {
					input: '$positions',
					as: 'position',
					in: {
						tml_event_id: '$$position.tml_event_id',
						operator_event_id: { $first: '$$position.operator_event_id' },
						insert_timestamp: '$$position.insert_timestamp',
						header_timestamp: '$$position.header_timestamp',
						vehicle_timestamp: { $first: '$$position.vehicle_timestamp' },
						odometer: { $first: '$$position.odometer' },
						lat: { $first: '$$position.lat' },
						lon: { $first: '$$position.lon' },
						stop_id: { $first: '$$position.stop_id' },
					},
				},
			},
		},
	};

	// 8.
	// Perform database search

	try {
		console.log('Searching events...');
		await PCGIDB.VehicleEvents.aggregate([matchClause, groupClause, projectClause], { allowDiskUse: true, maxTimeMS: 90000 }).stream().pipe(JSONStream.stringify()).pipe(res);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}