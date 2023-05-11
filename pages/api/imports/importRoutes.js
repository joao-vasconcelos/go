import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Model as LineModel } from '../../../schemas/Line/model';
import { Model as RouteModel } from '../../../schemas/Route/model';
import { Default as RouteDefault } from '../../../schemas/Route/default';

/* * */
/* IMPORT ROUTES */
/* Explanation needed. */
/* * */

export default async function importRoutes(req, res) {
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

  const allLines = await LineModel.find({});

  for (const line of allLines) {
    try {
      const response = await fetch(`https://schedules.carrismetropolitana.pt/api/routes/route_short_name/${line.line_code}`);
      const allRoutesForThisLine = await response.json();

      let createdRoutesIds = [];

      for (const routeObj of allRoutesForThisLine) {
        const createdRouteDoc = await RouteModel.findOneAndUpdate(
          { route_code: routeObj.route_id },
          {
            ...RouteDefault,
            route_code: routeObj.route_id,
            parent_line: line._id,
            route_name: routeObj.route_long_name,
          },
          { new: true, upsert: true }
        );
        createdRoutesIds.push(createdRouteDoc._id);
        console.log('saved route ', routeObj.route_long_name);
      }

      await LineModel.findOneAndUpdate(
        { _id: line._id },
        {
          routes: createdRoutesIds,
        },
        { new: true }
      );

      console.log('updated line', line.line_code);
      console.log('delay of 500 miliseconds');
      await delay(500);
    } catch (error) {
      console.log(error);
    }
  }

  return await res.status(200).json({ message: 'Done import.' });

  //
}
