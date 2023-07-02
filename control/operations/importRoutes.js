const RouteModel = require('../schemas/Route');
const LineModel = require('../schemas/Line');
const delay = require('../services/delay');

/* * */
/* IMPORT ROUTES */
/* Explanation needed. */
/* * */

module.exports = async function importRoutes() {
  //

  //
  // Fetch all Lines from database
  const allLines = await LineModel.find({});

  // Get route info for each line
  for (const line of allLines) {
    //
    // Skip if not A1
    if (!line.code.startsWith('1')) continue;

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
    line.save();

    console.log(`Updated Line ${line.code}`);
    await delay(500); // 1000 miliseconds of delay
    //
  }

  //
};
