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
    await RouteModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 6.
  // Update routes

  try {
    //

    // 6.1.
    // Retrieve all Lines from database
    const allLines = await LineModel.find({});

    // 6.2.
    // Iterate through each available Line
    for (const lineData of allLines) {
      //

      // 6.2.0.
      // Skip if this line is for A4
      if (lineData.code.startsWith('4')) continue;

      // 6.2.1.
      // Fetch routes for this line from API v1
      const allRoutesRes = await fetch(`https://schedules.carrismetropolitana.pt/api/routes/route_short_name/${lineData.short_name}`);
      const allRoutesApi = await allRoutesRes.json();

      // 6.2.2.
      // Setup a temporary variable to hold created route_ids
      let createdRoutesIds = [];

      // 6.2.3.
      // Parse each route
      for (const routeApi of allRoutesApi) {
        // Parse the route object
        const parsedRoute = {
          code: routeApi.route_id,
          name: routeApi.route_long_name,
          path_type: 1,
          parent_line: lineData._id,
          patterns: [],
        };
        // Save the route to the database
        const createdRouteDocument = await RouteModel.findOneAndUpdate({ code: parsedRoute.code }, parsedRoute, { new: true, upsert: true });
        // Save the route_id to the variable
        createdRoutesIds.push(createdRouteDocument._id);
        // Log progress
        console.log(`⤷ - Saved Route ${parsedRoute.code}`);
        //
      }

      // 6.2.4.
      // Add the created Route documents to the current line
      lineData.routes = createdRoutesIds;

      // 6.2.5.
      // Save the updated document
      await lineData.save();

      // 6.2.6.
      // Log progress
      console.log(`⤷ Updated Line ${lineData.code}`);
      console.log();

      // 6.2.7.
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
