/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import generator from '@/services/generator';
import * as turf from '@turf/turf';
import { StopDefault } from '@/schemas/Stop/default';
import { StopValidation } from '@/schemas/Stop/validation';
import { StopModel, DeletedStopModel } from '@/schemas/Stop/model';
import { ZoneModel } from '@/schemas/Zone/model';

/* * */

export default async function handler(req, res) {
  //

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
    await prepareApiEndpoint({ request: req, method: 'POST', session: sessionData, permissions: [{ scope: 'stops', action: 'create' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 5.
  // Validate req.body against schema

  try {
    // req.body = StopValidation.cast(req.body);
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message });
  }

  // 6.
  // Find out to which Zones this stop belongs to

  let zoneIdsForThisStop = [];

  try {
    const allZones = await ZoneModel.find();
    for (const zoneData of allZones) {
      // Skip if no geometry is set for this zone
      if (!zoneData.geojson?.geometry?.coordinates.length) continue;
      // Check if this stop is inside this zone boundary
      const isStopInThisZone = turf.booleanPointInPolygon([req.body.longitude, req.body.latitude], zoneData.geojson);
      // If it is, add this zone id to the stop
      if (isStopInThisZone) zoneIdsForThisStop.push(zoneData._id);
      //
    }
  } catch (error) {
    console.log(error);
    await res.status(500).json({ message: 'Error setting zones.' });
  }

  // 7.
  // Check for uniqueness

  try {
    // Create a new document for this stop
    let newDocument = { ...StopDefault, ...req.body, zones: zoneIdsForThisStop, code: `${req.body.municipality.prefix}${generator({ length: 4, type: 'numeric' })}`, municipality: req.body.municipality._id };
    newDocument = StopValidation.cast(newDocument);
    // The values that need to be unique are ['code'].
    while ((await StopModel.exists({ code: newDocument.code })) || (await DeletedStopModel.exists({ code: newDocument.code }))) {
      newDocument.code = `${req.body.municipality.prefix}${generator({ length: 4, type: 'numeric' })}`;
    }
    const createdDocument = await StopModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (error) {
    console.log(error);
    return await res.status(409).json({ message: error.message });
  }

  //
}
