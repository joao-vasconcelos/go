/* * */

import getSession from '@/authentication/getSession';
import PCGIDB from '@/services/PCGIDB';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
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
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ method: 'POST', permissions: [{ action: 'view', fields: [{ key: 'kind', values: ['realtime'] }], scope: 'reports' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 4.
	// Parse request body into JSON

	try {
		req.body = await JSON.parse(req.body);
	}
	catch (error) {
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
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Error converting date boundaries to miliseconds.' });
	}

	// 6.
	// Connect to PCGIDB

	try {
		await PCGIDB.connect();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Could not connect to PCGIDB.' });
	}

	// 7.
	// Prepare aggregation pipeline

	const matchClause = {
		$match: {
			$and: [
				{
					$and: [
						{
							'$and': [
								{
									'content.entity.vehicle.trip.tripId': { $exists: true, $ne: null },
								},
							],
							'content.entity.vehicle.agencyId': req.body.agency_code,
						},
					],
					millis: { $gte: operationDayStartMilis, $lte: operationDayEndMilis },
				},
			],
		},
	};

	const groupClause = {
		$group: {
			_id: '$content.entity.vehicle.trip.tripId',
			driver_id: { $addToSet: '$content.entity.vehicle.vehicle.driverId' },
			line_id: { $first: '$content.entity.vehicle.trip.lineId' },
			num_events: { $sum: 1 },
			pattern_id: { $first: '$content.entity.vehicle.trip.patternId' },
			positions: {
				$push: {
					header_timestamp: '$content.header.timestamp',
					insert_timestamp: '$millis',
					lat: '$content.entity.vehicle.position.latitude',
					lon: '$content.entity.vehicle.position.longitude',
					odometer: '$content.entity.vehicle.position.odometer',
					operator_event_id: '$content.entity._id',
					stop_id: '$content.entity.vehicle.stopId',
					tml_event_id: '$_id',
					vehicle_timestamp: '$content.entity.vehicle.timestamp',
				},
			},
			route_id: { $first: '$content.entity.vehicle.trip.routeId' },
			trip_id: { $first: '$content.entity.vehicle.trip.tripId' },
			vehicle_id: { $addToSet: '$content.entity.vehicle.vehicle._id' },
		},
	};

	const projectClause = {
		$project: {
			_id: 0,
			driver_id: 1,
			line_id: { $first: '$line_id' },
			num_events: 1,
			pattern_id: { $first: '$pattern_id' },
			positions: {
				$map: {
					as: 'position',
					in: {
						header_timestamp: '$$position.header_timestamp',
						insert_timestamp: '$$position.insert_timestamp',
						lat: { $first: '$$position.lat' },
						lon: { $first: '$$position.lon' },
						odometer: { $first: '$$position.odometer' },
						operator_event_id: { $first: '$$position.operator_event_id' },
						stop_id: { $first: '$$position.stop_id' },
						tml_event_id: '$$position.tml_event_id',
						vehicle_timestamp: { $first: '$$position.vehicle_timestamp' },
					},
					input: '$positions',
				},
			},
			route_id: { $first: '$route_id' },
			trip_id: { $first: '$trip_id' },
			vehicle_id: 1,
		},
	};

	// 8.
	// Perform database search

	try {
		console.log('Searching events...');
		await PCGIDB.VehicleEvents.aggregate([matchClause, groupClause, projectClause], { allowDiskUse: true, maxTimeMS: 90000 }).stream().pipe(JSONStream.stringify()).pipe(res);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Cannot list VehicleEvents.' });
	}

	//
}
