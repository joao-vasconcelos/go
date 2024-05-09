/* * */

import { RouteModel } from '@/schemas/Route/model';
import { LineModel } from '@/schemas/Line/model';
import getSession from '@/authentication/getSession';
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
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
	} catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// Ensure latest schema modifications are applied in the database.

	try {
		await RouteModel.syncIndexes();
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot sync indexes.' });
	}

	// 6.
	// Update routes

	try {
		//

		// 6.1.
		// Retrieve all Lines from database
		const allLines = await LineModel.find();

		// 6.2.
		// Iterate through each available Line
		for (const lineData of allLines) {
			//

			// 6.2.0.
			// Skip if this line is not A2
			if (lineData.code !== '2797') continue;

			// 6.2.1.
			// Skip if route is locked
			if (lineData?.is_locked) continue;

			// 6.2.1.
			// Fetch routes for this line from API v2
			const lineApiRes = await fetch(`https://api.carrismetropolitana.pt/lines/${lineData.code}`);
			const lineApi = await lineApiRes.json();
			if (!lineApi?.routes) continue;

			// 6.2.2.
			// Setup a temporary variable to hold created route_ids
			let createdRoutesIds = [];

			// 6.2.3.
			// Parse each route
			for (const routeId of lineApi.routes) {
				// Skip if route is locked
				const routeGo = await RouteModel.findOne({ code: routeId });
				if (routeGo?.is_locked) continue;

				// Fetch routes for this line from API v2
				const routeApiRes = await fetch(`https://api.carrismetropolitana.pt/routes/${routeId}`);
				const routeApi = await routeApiRes.json();
				// Parse the route object
				const parsedRoute = {
					code: routeApi.id,
					name: routeApi.long_name,
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
			// Wait for 150 miliseconds to ensure no rate limits are hit
			await delay(150);

			//
		}

		//
	} catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Import Error' });
	}

	// 7.
	// Log progress
	console.log('⤷ Done. Sending response to client...');
	return await res.status(200).json('Import complete.');
}