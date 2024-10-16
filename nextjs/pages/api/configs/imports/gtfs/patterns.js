/* * */

import getSession from '@/authentication/getSession';
import { CalendarModel } from '@/schemas/Calendar/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { RouteModel } from '@/schemas/Route/model';
import { StopModel } from '@/schemas/Stop/model';
import generate from '@/services/generator';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

/* * */

export default async function handler(req, res) {
	//

	throw new Error('Feature is disabled.');

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
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'admin', scope: 'configs' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// Ensure latest schema modifications are applied in the database.

	try {
		await PatternModel.syncIndexes();
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot sync indexes.' });
	}

	// 6.
	// Update patterns

	try {
		//

		// 6.1.
		// Retrieve all Routes from database
		const allRoutes = await RouteModel.find();

		// 6.2.
		// Iterate through each available Route
		for (const route of allRoutes) {
			//

			// 6.2.0.
			// Skip if this route is not A2
			if (!route.code.startsWith('2797')) continue;
			//   if (route.code.startsWith('2')) continue;
			//   if (route.code.startsWith('3')) continue;
			//   if (route.code.startsWith('4')) continue;

			// 6.2.1.
			// Skip if route is locked
			if (route.is_locked) continue;

			// 6.2.1.
			// Fetch info for this Route from API v1
			const routeApiRes = await fetch(`https://schedules.carrismetropolitana.pt/api/routes/route_id/${route.code}`);
			const routeApi = await routeApiRes.json();

			// 6.2.2.
			// Skip if this Route has no directions
			if (!routeApi.directions?.length) continue;

			// 6.2.3.
			// Setup a temporary variable to hold created pattern_ids
			let createdPatternsIds = [];

			// 6.2.4.
			// Parse each route direction
			for (const directionApi of routeApi.directions) {
				//

				// 6.2.4.1.
				// Tranform distances to meters
				let metersOrKm = 1;
				if (route.code.startsWith('1')) metersOrKm = 1000; // A1 is in kilometers
				if (route.code.startsWith('2')) metersOrKm = 1; // A2 is in meters
				if (route.code.startsWith('3')) metersOrKm = 1000; // A3 is in kilometers
				if (route.code.startsWith('4')) metersOrKm = 1000; // A3 is in kilometers

				//
				// SHAPE

				// 6.2.4.2.
				// Get info for the Shape from API v2
				const shapeApiRes = await fetch(`https://api.carrismetropolitana.pt/shapes/${directionApi.shape[0].shape_id}`);
				const shapeApi = await shapeApiRes.json();

				// 6.2.4.3.
				// Parse the Shape to match GO schema
				const shapeForThisPattern = { extension: shapeApi.extension, geojson: shapeApi.geojson, points: [] };
				shapeForThisPattern.points = shapeApi.points.map((point) => {
					return { ...point, shape_dist_traveled: Number(point.shape_dist_traveled) * metersOrKm };
				});

				//
				// PATH

				// 6.2.4.4.
				// Initiate temporary variables
				let pathForThisPattern = [];
				let prevDistance = 0;
				let prevArrivalTime = '';
				let cumulativeVelocity = 0;

				// 6.2.4.5.
				// Parse the Path to match GO schema
				for (const [tripApiIndex, tripApiStop] of directionApi.trips[0]?.schedule.entries()) {
					//

					// 6.2.4.5.1.
					// Get _id of associated Stop document
					const associatedStopDocument = await StopModel.findOne({ code: tripApiStop.stop_id });

					// 6.2.4.5.2.
					// Calculate distance delta for this segment
					const accumulatedDistance = Number(tripApiStop.shape_dist_traveled);
					const distanceDelta = tripApiIndex === 0 ? 0 : accumulatedDistance * metersOrKm - prevDistance;
					prevDistance = accumulatedDistance * metersOrKm;

					// 6.2.4.5.3.
					// Calculate velocity for this segment
					let velocityInThisSegment = 0;
					let travelTimeInThisSegmentInSeconds = 0;
					let travelTimeInThisSegmentInHours = 0;
					if (tripApiIndex > 0) {
						// Calculate the time difference in hours
						let startTimeArr = prevArrivalTime.split(':').map(Number);
						let arrivalTimeArr = tripApiStop.arrival_time_operation.split(':').map(Number);
						let startSeconds = startTimeArr[0] * 3600 + startTimeArr[1] * 60 + startTimeArr[2];
						let arrivalSeconds = arrivalTimeArr[0] * 3600 + arrivalTimeArr[1] * 60 + arrivalTimeArr[2];
						// Add 24 hours if arrival is on the next day
						if (arrivalSeconds < startSeconds) arrivalSeconds += 24 * 3600;
						// Convert to hours (for km per HOUR)
						travelTimeInThisSegmentInSeconds = arrivalSeconds - startSeconds;
						if (travelTimeInThisSegmentInSeconds === 0) travelTimeInThisSegmentInSeconds = 30;
						travelTimeInThisSegmentInHours = travelTimeInThisSegmentInSeconds / 3600;
						// Calculate velocity (distance / time)
						velocityInThisSegment = (distanceDelta / travelTimeInThisSegmentInSeconds) * 3.6;
					}

					// 6.2.4.5.4.
					// Add the current velocity to calculate average
					cumulativeVelocity += velocityInThisSegment;

					// 6.2.4.5.5.
					// Set previous arrival time to the current segment value
					prevArrivalTime = tripApiStop.departure_time_operation;

					//   console.log('------------------------------');
					//   console.log('distanceDelta', distanceDelta);
					//   console.log('velocityInThisSegment', velocityInThisSegment);
					//   console.log('travelTimeInThisSegmentInSeconds', travelTimeInThisSegmentInSeconds);
					//   console.log('travelTimeInThisSegmentInHours', travelTimeInThisSegmentInHours);
					//   console.log('------------------------------');

					// 6.2.4.5.6.
					// Save this segment to the temporary variable
					pathForThisPattern.push({
						allow_drop_off: true,
						allow_pickup: true,
						default_dwell_time: 30,
						default_travel_time: parseInt(travelTimeInThisSegmentInSeconds),
						default_velocity: parseInt(velocityInThisSegment),
						distance_delta: parseInt(distanceDelta),
						stop: associatedStopDocument._id,
						zones: associatedStopDocument.zones,
					});

					//
				}

				// 6.2.4.6.
				// Calculate average velocity for this pattern
				const averageVelocity = cumulativeVelocity / pathForThisPattern.length;

				//
				// SCHEDULES

				// 6.2.4.7.
				// Setup temporary variable
				let schedulesForThisPattern = [];

				// 6.2.4.8.
				// Import schedules for this pattern
				for (const tripApi of directionApi.trips) {
					//

					// 6.2.4.8.1.
					// Retrieve available Calendars from the database
					const allCalendars = await CalendarModel.find();

					// 6.2.4.8.2.
					// Join all dates into a comma separated string
					const calendarForThisTripAsStrings = tripApi.dates.join(',');

					// 6.2.4.8.3.
					// Check if any Calendar matches the set calendar for this trip
					let matchingCalendar = allCalendars.find((calendar) => {
						const calendarStrings = calendar.dates.join(',');
						return calendarStrings === calendarForThisTripAsStrings;
					});

					// 6.2.4.8.4.
					// If no matching Calendar was found, then create a new one with an unique code
					if (!matchingCalendar || matchingCalendar.length === 0) {
						let newCalendarCode = tripApi.service_id || generate(4);
						while (await CalendarModel.exists({ code: newCalendarCode })) {
							newCalendarCode = generate(4);
						}
						matchingCalendar = await CalendarModel.findOneAndUpdate({ code: newCalendarCode }, { code: newCalendarCode, dates: tripApi.dates }, { new: true, upsert: true });
					}

					// 6.2.4.8.5.
					// Save this schedule to the temporary variable
					schedulesForThisPattern.push({
						calendar_desc: tripApi.calendar_desc,
						calendars_off: [],
						calendars_on: [matchingCalendar._id],
						path_overrides: [],
						start_time: tripApi.schedule[0].arrival_time_operation.substring(0, 5),
						vehicle_features: {
							allow_bicycles: true,
							passenger_counting: true,
							propulsion: 0,
							type: 0,
							video_surveillance: true,
						},
					});

					//
				}

				//
				// PATTERN

				// 6.2.4.9.
				// Parse the pattern object to match GO schema
				const patternObject = {
					code: directionApi.pattern_id,
					direction: Number(directionApi.direction_id),
					headsign: directionApi.headsign,
					parent_route: route?._id,
					path: pathForThisPattern,
					presets: {
						dwell_time: 30,
						velocity: parseInt(averageVelocity || 20),
					},
					schedules: schedulesForThisPattern,
					shape: shapeForThisPattern,
				};

				// Skip if pattern is locked
				const patternGo = await PatternModel.findOne({ code: patternObject.code });
				if (patternGo?.is_locked) continue;

				// 6.2.4.10.
				// Save this pattern to the database
				const createdPatternDocument = await PatternModel.findOneAndUpdate({ code: patternObject.code }, patternObject, { new: true, upsert: true });

				// 6.2.4.11.
				// Hold on to the created document _id to add to the current Route
				createdPatternsIds.push(createdPatternDocument._id);

				// 6.2.4.12.
				// Log progress
				console.log(`⤷ - Saved Pattern ${createdPatternDocument.code}`);

				//
			}

			// 6.2.5.
			// Update current route with created patterns
			route.patterns = createdPatternsIds;
			await route.save();

			// 6.2.6.
			// Log progress
			console.log(`⤷ Updated Route ${route.code}`);
			console.log();

			//
		}

		//
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Import Error' });
	}

	// 7.
	// Log progress
	console.log('⤷ Done. Sending response to client...');
	return await res.status(200).json('Import complete.');
}
