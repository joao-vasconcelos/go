/* * */

import getSession from '@/authentication/getSession';
import { PatternPathDefault, PatternShapeDefault } from '@/schemas/Pattern/default';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
import calculateTravelTime from '@/services/calculateTravelTime';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import * as turf from '@turf/turf';

/* * */

export default async function handler(req, res) {
	//

	// 1.
	// Setup variables

	let sessionData;
	let patternDocument;

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
		await prepareApiEndpoint({ method: 'PUT', permissions: [{ action: 'edit', scope: 'lines' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 3.
	// Parse request body into JSON

	try {
		req.body = await JSON.parse(req.body);
	}
	catch (error) {
		console.log(error);
		await res.status(500).json({ message: 'JSON parse error.' });
		return;
	}

	// 5.
	// Get current pattern from MongoDB

	try {
		patternDocument = await PatternModel.findOne({ _id: { $eq: req.query._id } }).populate('path.stop');
		if (!patternDocument) return await res.status(404).json({ message: 'Could not find requested Pattern in database.' });
	}
	catch (error) {
		console.log(error);
		await res.status(500).json({ message: 'Error fetching pattern from database.' });
		return;
	}

	// 6.
	// Update Shape

	if (req.body.shape && req.body.shape.length) {
		try {
			// Initiate pattern shape
			patternDocument.shape = { ...PatternShapeDefault };
			// Sort points to match sequence
			patternDocument.shape.points = req.body.shape.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence);
			// Create geojson feature using turf
			patternDocument.shape.geojson = turf.lineString(patternDocument.shape.points.map(point => [parseFloat(point.shape_pt_lon), parseFloat(point.shape_pt_lat)]));
			// Calculate shape extension from geojson feature
			const extensionInKilometers = turf.length(patternDocument.shape.geojson, { units: 'kilometers' });
			const extensionInMeters = extensionInKilometers * 1000;
			patternDocument.shape.extension = parseInt(extensionInMeters);
		}
		catch (error) {
			console.log(error);
			return await res.status(500).json({ message: 'Could not handle points in Shape.' });
		}
	}
	else {
		try {
			// Reset geojson and extension if shape has no points
			patternDocument.shape = { ...PatternShapeDefault };
		}
		catch (error) {
			console.log(error);
			return await res.status(500).json({ message: 'Could not handle no points in Shape.' });
		}
	}

	// 7.
	// Update Path

	try {
		// Sort path stops based on stop_sequence
		req.body.path.sort((a, b) => a.stop_sequence - b.stop_sequence);
		// Initiate temp variable to keep formatted path
		let formattedPath = [];
		// Initiate variable to hold distance
		let prevDistance = 0;
		// Iterate on each path stop
		for (const [pathIndex, pathItem] of req.body.path.entries()) {
			// Get _id of associated Stop document
			const associatedStopDocument = await StopModel.findOne({ code: pathItem.stop_id.trim() });
			// Throw an error if no stop is found
			if (!associatedStopDocument) throw Error(`The stop "${pathItem.stop_id}" does not exist in GO.`);
			// Get original path stop from non-modified document
			const originalPathStop = patternDocument.path.find(item => item.stop?.id === associatedStopDocument?.id);
			// Calculate distance delta
			const distanceDelta = pathIndex === 0 ? 0 : parseInt(pathItem.shape_dist_traveled) - prevDistance;
			prevDistance = parseInt(pathItem.shape_dist_traveled);
			// Calculate travel time
			const travelTime = calculateTravelTime(distanceDelta, patternDocument.presets.velocity || PatternPathDefault.default_velocity);
			// Add this sequence item to the document path
			formattedPath.push({
				// Include the defaults
				...PatternPathDefault,
				allow_drop_off: originalPathStop?.allow_drop_off || PatternPathDefault.allow_drop_off,
				allow_pickup: originalPathStop?.allow_pickup || PatternPathDefault.allow_pickup,
				default_dwell_time: originalPathStop?.default_dwell_time || patternDocument.presets.dwell_time || PatternPathDefault.default_dwell_time,
				// Replace defaults with geographical data specific to the updated pattern
				default_travel_time: travelTime,
				// Replace defaults with original data, if path stop is available; otherwise use presets or defaults
				default_velocity: originalPathStop?.default_velocity || patternDocument.presets.velocity || PatternPathDefault.default_velocity,
				distance_delta: distanceDelta,
				stop: associatedStopDocument._id,
				zones: originalPathStop?.zones || associatedStopDocument.zones,
			});
		}
		//
		patternDocument.path = formattedPath;
		//
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: error.message || 'Error processing path.' });
	}

	// 8.
	// Replace the path for this pattern

	try {
		// Save changes to document
		patternDocument.save();
		// Return updated document
		return await res.status(200).json(patternDocument);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot update this Pattern.' });
	}

	//
}
