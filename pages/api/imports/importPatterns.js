import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Model as LineModel } from '../../../schemas/Line/model';
import { Model as RouteModel } from '../../../schemas/Route/model';
import { Default as RouteDefault } from '../../../schemas/Route/default';
import { Default as PatternDefault } from '../../../schemas/Pattern/default';
import { Model as PatternModel } from '../../../schemas/Pattern/model';
import { Model as ShapeModel } from '../../../schemas/Shape/model';
import { Model as StopModel } from '../../../schemas/Stop/model';
import { Model as CalendarModel } from '../../../schemas/Calendar/model';
import { Default as CalendarDefault } from '../../../schemas/Calendar/default';

/* * */
/* IMPORT ROUTES */
/* Explanation needed. */
/* * */

export default async function importPatterns(req, res) {
  //
  await delay();

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  const allRoutes = await RouteModel.find({});

  for (const route of allRoutes) {
    try {
      const response = await fetch(`https://schedules.carrismetropolitana.pt/api/routes/route_id/${route.code}`);
      const routeInfo = await response.json();

      let createdPatternsIds = [];

      for (const direction of routeInfo.directions) {
        //

        const shapeId = await ShapeModel.findOne({ name: direction.shape[0].shape_id, code: direction.shape[0].shape_id });
        console.log('Shape_id', direction.shape[0].shape_id);

        // Manage Path
        let pathForThisPattern = [];
        for (const tripScheduleStop of direction.trips[0].schedule) {
          //
          const stopId = await StopModel.findOne({ code: tripScheduleStop.stop_id });
          //   console.log('tripScheduleStop.stop_id', tripScheduleStop.stop_id);
          //   console.log('stop_id', stopId._id);

          pathForThisPattern.push({
            stop: stopId._id,
            allow_pickup: true,
            allow_drop_off: true,
            distance_delta: 0,
            default_velocity: 0,
            default_travel_time: 0,
            default_dwell_time: 0,
            apex: [],
          });
        }
        console.log('Done with path');

        // Manage Schedules
        let schedulesForThisPattern = [];
        for (const trip of direction.trips) {
          //

          const allCalendars = await CalendarModel.find({});
          const calendarsForThisTripAsStrings = trip.dates.join(',');

          let matchingCalendar = allCalendars.find((calendar) => {
            const calendarStrings = calendar.dates.join(',');
            return calendarStrings === calendarsForThisTripAsStrings;
          });

          if (!matchingCalendar || matchingCalendar.length === 0) {
            matchingCalendar = await CalendarModel({ ...CalendarDefault, name: trip.service_id, code: trip.service_id, dates: trip.dates }).save();
            console.log('Created Calendar:', matchingCalendar.code);
          } else console.log('Used existing Calendar:', matchingCalendar.code);

          schedulesForThisPattern.push({
            start_time: trip.schedule[0].arrival_time,
            calendars_on: [matchingCalendar._id],
            calendars_off: [],
            path_overrides: [],
          });
          console.log('Done with trip');
        }
        console.log('Done with schedules');

        const patternObject = {
          ...PatternDefault,
          code: `${route.code}_${direction.direction_id}`,
          parent_route: route._id,
          direction: Number(direction.direction_id),
          headsign: direction.headsign,
          shape: shapeId,
          path: pathForThisPattern,
          schedules: schedulesForThisPattern,
        };

        const createdPatternDoc = await PatternModel.findOneAndUpdate({ code: `${route.code}_${direction.direction_id}` }, patternObject, { new: true, upsert: true });
        createdPatternsIds.push(createdPatternDoc._id);
        console.log('Saved Pattern', createdPatternDoc.code);
      }

      await RouteModel.findOneAndUpdate(
        { _id: route._id },
        {
          patterns: createdPatternsIds,
        },
        { new: true }
      );

      console.log('Updated Route', route.code);
      console.log('Delay of 250 miliseconds');
      await delay(250);
    } catch (error) {
      console.log(error);
    }
  }

  return await res.status(200).json({ message: 'Done import.' });

  //
}
