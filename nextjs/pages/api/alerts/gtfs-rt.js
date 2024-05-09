/* * */

import mongodb from '@/services/OFFERMANAGERDB';
import { AlertModel } from '@/schemas/Alert/model';
import { DateTime } from 'luxon';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Check service_key in request header

	if (req.method !== 'GET') {
		return await res.status(400).json('Invalid request method.');
	}

	// 2.
	// Check service_key in request header

	if (req.headers?.key !== process.env.GTFSRT_SERVICE_ALERTS_SERVICE_SECRET_KEY) {
		console.log('Invalid service key.');
		return await res.status(401).json('Invalid service key');
	}

	// 3.
	// Connect to MongoDB

	try {
		await mongodb.connect();
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: 'Could not connect to MongoDB.' });
	}

	// 4.
	// List all scheduled documents

	try {
		//
		const allPublishedAlerts = await AlertModel.find({ status: 'published' });

		//
		const allCurrentAlerts = allPublishedAlerts.filter((item) => {
			const startIsBeforeNow = new Date(item.publish_start) <= new Date;
			const endIsAfterNow = item.publish_end ? new Date(item.publish_end) >= new Date : true;
			return startIsBeforeNow && endIsAfterNow;
		});

		console.log(allCurrentAlerts);
		//
		//
		//
		//
		//

		const gtfsRtServiceAlertsFeed = {
			header: {
				gtfsRealtimeVersion: '2.0',
				incrementality: 'FULL_DATASET',
				timestamp: DateTime.now().toUnixInteger(),
			},
			entity: [],
		};

		gtfsRtServiceAlertsFeed.entity = allCurrentAlerts.map((item) => {
			//
			const parsedAlert = {
				id: item.code,
				alert: {
					activePeriod: [
						{
							start: DateTime.fromJSDate(item.active_period_start).toUnixInteger(),
							end: item.active_period_end ? DateTime.fromISO(item.active_period_end).toUnixInteger() : undefined,
						},
					],
					informedEntity: [
						{
							routeId: '2310_0',
						},
						{
							routeId: '2328_0',
						},
						{
							routeId: '2331_0',
						},
						{
							routeId: '2333_0',
						},
						{
							routeId: '2535_0',
						},
						{
							routeId: '2842_0',
						},
						{
							routeId: '2926_0',
						},
						{
							routeId: '2927_0',
						},
					],
					cause: item.cause,
					effect: item.effect,
					url: {
						translation: [
							{
								language: 'pt',
								text: `https://on.carrismetropolitana.pt/alerts/${item.code}`,
							},
						],
					},
					headerText: {
						translation: [
							{
								language: 'pt',
								text: item.title,
							},
						],
					},
					descriptionText: {
						translation: [
							{
								language: 'pt',
								text: item.description,
							},
						],
					},
					image: {
						localizedImage: [
							{
								language: 'pt',
								mediaType: '',
								url: '',
							},
						],
					},
				},
			};
			//
			switch (item.type) {
			case 'select_stops':
				parsedAlert.alert.informedEntity = item.affected_stops.flatMap(({ stop_id, specific_routes }) => {
					if (!specific_routes?.length) return [{ stop_id: stop_id }];
					return specific_routes.map((route_id) => ({ stop_id: stop_id, route_id: route_id }));
				});
				break;
			case 'select_routes':
				parsedAlert.alert.informedEntity = item.affected_routes.flatMap(({ route_id, specific_stops }) => {
					if (!specific_stops?.length) return [{ route_id: route_id }];
					return specific_stops.map((stop_id) => ({ route_id: route_id, stop_id: stop_id }));
				});
				break;
			case 'select_agencies':
				parsedAlert.alert.informedEntity = item.affected_agencies.map(({ agency_id }) => ({ agency_id: agency_id }));
				break;
			default:
				break;
			}
			//
			return parsedAlert;
			//
		});

		return await res.status(200).send(gtfsRtServiceAlertsFeed);
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Alerts.' });
	}

	//
}