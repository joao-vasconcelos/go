import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import generate from '@/services/generator';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
import { CalendarModel } from '@/schemas/Calendar/model';

/* * */
/* IMPORT PATTERNS */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  throw new Error('Feature is disabled.');

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
  // Ensure latest schema modifications are applied in the database.

  try {
    await PatternModel.syncIndexes();
  } catch (err) {
    console.log(err);
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
      // Skip if this route is for A4
      if (route.code.startsWith('4')) continue;

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
        const shapeForThisPattern = { extension: shapeApi.extension, points: [], geojson: shapeApi.geojson };
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
            var startTimeArr = prevArrivalTime.split(':').map(Number);
            var arrivalTimeArr = tripApiStop.arrival_time_operation.split(':').map(Number);
            var startSeconds = startTimeArr[0] * 3600 + startTimeArr[1] * 60 + startTimeArr[2];
            var arrivalSeconds = arrivalTimeArr[0] * 3600 + arrivalTimeArr[1] * 60 + arrivalTimeArr[2];
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
            stop: associatedStopDocument._id,
            allow_pickup: true,
            allow_drop_off: true,
            distance_delta: parseInt(distanceDelta),
            default_velocity: parseInt(velocityInThisSegment),
            default_travel_time: parseInt(travelTimeInThisSegmentInSeconds),
            default_dwell_time: 30,
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
            matchingCalendar = await CalendarModel.findOneAndUpdate({ code: newCalendarCode }, { code: newCalendarCode, dates: tripApi.dates }, { upsert: true, new: true });
          }

          // 6.2.4.8.5.
          // Save this schedule to the temporary variable
          schedulesForThisPattern.push({
            start_time: tripApi.schedule[0].arrival_time_operation.substring(0, 5),
            calendars_on: [matchingCalendar._id],
            calendars_off: [],
            calendar_desc: tripApi.calendar_desc,
            vehicle_features: {
              type: 0,
              propulsion: 0,
              allow_bicycles: true,
              passenger_counting: true,
              video_surveillance: true,
            },
            path_overrides: [],
          });

          //
        }

        //
        // PATTERN

        // 6.2.4.9.
        // Parse the pattern object to match GO schema
        const patternObject = {
          code: directionApi.pattern_id,
          parent_route: route._id,
          direction: Number(directionApi.direction_id),
          headsign: directionApi.headsign,
          shape: shapeForThisPattern,
          path: pathForThisPattern,
          schedules: schedulesForThisPattern,
          presets: {
            velocity: parseInt(averageVelocity || 20),
            dwell_time: 30,
          },
        };

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

      // 6.2.6.
      // Wait for 250 miliseconds to ensure no rate limits are hit
      await delay(250);

      //
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  // 7.
  // Log progress
  console.log('⤷ Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
