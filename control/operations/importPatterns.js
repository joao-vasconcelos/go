const ShapeModel = require('../schemas/Shape');
const CalendarModel = require('../schemas/Calendar');
const RouteModel = require('../schemas/Route');
const PatternModel = require('../schemas/Pattern');
const StopModel = require('../schemas/Stop');
const delay = require('../services/delay');

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
    // Skip if not A4
    if (!route.code.startsWith('4')) continue;

    // Get info for the Route from API v1
    const response = await fetch(`https://schedules.carrismetropolitana.pt/api/routes/route_id/${route.code}`);
    const routeApi = await response.json();

    // Parse and add each pattern to the database
    let createdPatternsIds = [];
    for (const directionApi of routeApi.directions) {
      //

      // SHAPE
      // Get info for the Shape from API v2
      const response = await fetch(`https://schedules-test.carrismetropolitana.pt/api/shapes/${directionApi.shape[0].shape_id}`);
      const shapeApi = await response.json();
      //
      const shapeDocument = await ShapeModel.findOneAndUpdate({ code: shapeApi.code }, { code: shapeApi.code, name: shapeApi.code, extension: shapeApi.extension, points: shapeApi.points, geojson: shapeApi.geojson }, { new: true, upsert: true });
      console.log(`Updated Shape ${shapeDocument.code}`);
      //

      // PATH
      // Parse the path for this pattern
      let pathForThisPattern = [];
      let prevDistance = 0;
      for (const [tripScheduleIndex, tripScheduleStop] of directionApi.trips[0].schedule.entries()) {
        //
        // Get _id of associated Stop document
        const associatedStopDocument = await StopModel.findOne({ code: tripScheduleStop.stop_id });
        // Calculate distance delta
        const distanceDelta = tripScheduleIndex === 0 ? 0 : Number(tripScheduleStop.shape_dist_traveled) * 1000 - prevDistance;
        prevDistance = Number(tripScheduleStop.shape_dist_traveled);

        pathForThisPattern.push({
          stop: associatedStopDocument._id,
          allow_pickup: true,
          allow_drop_off: true,
          distance_delta: 100,
          default_velocity: 20,
          default_travel_time: 0,
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
          matchingCalendar = await CalendarModel.findOneAndUpdate({ code: tripApi.service_id }, { code: tripApi.service_id, dates: tripApi.dates });
          console.log(`Created Calendar with code ${matchingCalendar?.code}`);
        } else console.log(`Used existing Calendar ${matchingCalendar?.code}`);

        schedulesForThisPattern.push({
          start_time: tripApi.schedule[0].arrival_time_operation.substring(0, 5),
          calendars_on: [matchingCalendar?._id],
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
        shape: shapeDocument._id,
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
    await delay(500); // 500 miliseconds of delay
    //
  }

  //
};
