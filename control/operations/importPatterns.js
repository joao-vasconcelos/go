const CalendarModel = require('../schemas/Calendar');
const RouteModel = require('../schemas/Route');
const PatternModel = require('../schemas/Pattern');
const StopModel = require('../schemas/Stop');
const delay = require('../services/delay');
const generate = require('../services/generator');

/* * */
/* IMPORT PATTERNS */
/* Explanation needed. */
/* * */

module.exports = async function importPatterns() {
  //
  // Fetch all Routes from database
  const allRoutes = await RouteModel.find({});

  // Get route info for each line
  for (const route of allRoutes) {
    //
    // Skip if not A1
    if (!route.code.startsWith('2')) continue;

    // Get info for the Route from API v1
    const response = await fetch(`https://schedules.carrismetropolitana.pt/api/routes/route_id/${route.code}`);
    const routeApi = await response.json();

    // Skip if no directions
    if (!routeApi.directions) continue;

    // Parse and add each pattern to the database
    let createdPatternsIds = [];
    for (const directionApi of routeApi.directions) {
      //

      // SHAPE
      // Get info for the Shape from API v2
      const response = await fetch(`https://schedules-test.carrismetropolitana.pt/api/shapes/${directionApi.shape[0].shape_id}`);
      const shapeApi = await response.json();
      //
      const shapeForThisPattern = { extension: shapeApi.extension, points: shapeApi.points, geojson: shapeApi.geojson };
      //

      // PATH
      // Parse the path for this pattern
      let pathForThisPattern = [];
      let prevDistance = 0;
      let prevArrivalTime = '';
      for (const [tripScheduleIndex, tripScheduleStop] of directionApi.trips[0].schedule.entries()) {
        //
        // Get _id of associated Stop document
        const associatedStopDocument = await StopModel.findOne({ code: tripScheduleStop.stop_id });

        // Calculate distance delta
        const metersOrKm = 1;
        const distanceDelta = tripScheduleIndex === 0 ? 0 : Number(tripScheduleStop.shape_dist_traveled) * metersOrKm - prevDistance;
        prevDistance = Number(tripScheduleStop.shape_dist_traveled);

        let velocityInThisSegment = 0;
        let travelTimeInThisSegment = 0;
        if (tripScheduleIndex > 0) {
          // Calculate the time difference in hours
          var startTimeArr = tripScheduleStop.arrival_time_operation.split(':').map(Number);
          var arrivalTimeArr = prevArrivalTime.split(':').map(Number);
          var startSeconds = startTimeArr[0] * 3600 + startTimeArr[1] * 60 + startTimeArr[2];
          var arrivalSeconds = arrivalTimeArr[0] * 3600 + arrivalTimeArr[1] * 60 + arrivalTimeArr[2];
          // Add 24 hours if arrival is on the next day
          if (arrivalSeconds < startSeconds) arrivalSeconds += 24 * 3600;
          // Convert to hours (for km per HOUR)
          travelTimeInThisSegment = (arrivalSeconds - startSeconds) / 3600;
          if (travelTimeInThisSegment === 0) travelTimeInThisSegment = 1;
          // Convert distance to kilometers (for KM per hour)
          const distanceInKm = distanceDelta / metersOrKm;
          // Calculate velocity (distance / time)
          velocityInThisSegment = distanceInKm / travelTimeInThisSegment;
        }

        prevArrivalTime = tripScheduleStop.departure_time_operation;

        // console.log('distanceDelta', distanceDelta);
        // console.log('velocityInThisSegment', velocityInThisSegment);
        // console.log('travelTimeInThisSegment', travelTimeInThisSegment);

        pathForThisPattern.push({
          stop: associatedStopDocument._id,
          allow_pickup: true,
          allow_drop_off: true,
          distance_delta: distanceDelta,
          default_velocity: velocityInThisSegment,
          default_travel_time: travelTimeInThisSegment,
          default_dwell_time: 30,
          zones: associatedStopDocument.zones,
        });
      }
      //

      // SCHEDULES
      // Import schedules for this pattern
      let schedulesForThisPattern = [];
      for (const tripApi of directionApi.trips) {
        //
        const allCalendars = await CalendarModel.find({});
        const calendarForThisTripAsStrings = tripApi.dates.join(',');

        let matchingCalendar = allCalendars.find((calendar) => {
          const calendarStrings = calendar.dates.join(',');
          return calendarStrings === calendarForThisTripAsStrings;
        });

        if (!matchingCalendar || matchingCalendar.length === 0) {
          let newCalendarCode = tripApi.service_id || generate(4);
          while (await CalendarModel.exists({ code: newCalendarCode })) {
            newCalendarCode = generate(4);
          }
          matchingCalendar = await CalendarModel.findOneAndUpdate({ code: newCalendarCode }, { code: newCalendarCode, dates: tripApi.dates }, { upsert: true, new: true });
          console.log(`Created Calendar with code ${matchingCalendar.code}`);
        } else console.log(`Used existing Calendar ${matchingCalendar.code}`);

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
      }
      //

      // Save the pattern object
      const patternObject = {
        code: directionApi.pattern_id,
        parent_route: route._id,
        direction: Number(directionApi.direction_id),
        headsign: directionApi.headsign,
        shape: shapeForThisPattern,
        path: pathForThisPattern,
        schedules: schedulesForThisPattern,
      };

      const createdPatternDoc = await PatternModel.findOneAndUpdate({ code: patternObject.code }, patternObject, { new: true, upsert: true });
      createdPatternsIds.push(createdPatternDoc._id);
      console.log(`Saved Pattern ${createdPatternDoc.code}`);
    }

    // Update parent route with created patterns
    route.patterns = createdPatternsIds;
    route.save();

    console.log(`Updated Route ${route.code}`);
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    await delay(250); // 250 miliseconds of delay
    //
  }

  //
};
