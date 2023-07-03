import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { Model as RouteModel } from '@/schemas/Route/model';
import { Model as LineModel } from '@/schemas/Line/model';

/* * */
/* IMPORT ROUTES */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

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
  // Connect to mongodb

  try {
    //
    // Fetch all Lines from database
    const allLines = await LineModel.find({});

    // Get route info for each line
    for (const line of allLines) {
      //
      // Skip if not A1
      //   if (!line.code.startsWith('2')) continue;

      // Get info for the route from API v1
      const response = await fetch(`https://schedules.carrismetropolitana.pt/api/routes/route_short_name/${line.short_name}`);
      const allRoutesApiForThisLine = await response.json();

      // Parse and add each route to the database
      let createdRoutesIds = [];
      for (const routeApi of allRoutesApiForThisLine) {
        // Parse the route object
        const parsedRoute = {
          code: routeApi.route_id,
          name: routeApi.route_long_name,
          path_type: 1,
          parent_line: line._id,
          patterns: [],
        };
        // Save the route to the database
        const createdRouteDocument = await RouteModel.findOneAndUpdate({ code: parsedRoute.code }, parsedRoute, { new: true, upsert: true });
        createdRoutesIds.push(createdRouteDocument._id);
        console.log(`Saved Route ${parsedRoute.code}`);
      }

      // Add the created Route objects to the current line, and save the updated document
      line.routes = createdRoutesIds;
      await line.save();

      console.log(`Updated Line ${line.code}`);
      await delay(250); // 250 miliseconds of delay
      //
    }
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
