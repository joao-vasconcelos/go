/* * */

import mongodb from '@/services/mongodb';
import getSession from '@/authentication/getSession';
import isAllowed from '@/authentication/isAllowed';
import generator from '@/services/generator';
import * as turf from '@turf/turf';
import { StopDefault } from '@/schemas/Stop/default';
import { StopValidation } from '@/schemas/Stop/validation';
import { StopModel } from '@/schemas/Stop/model';
import { ZoneModel } from '@/schemas/Zone/model';
import { ForbiddenStopIds } from '@/schemas/Stop/forbiddenStopIds';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;

  // 2.
  // Refuse request if not POST

  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 3.
  // Check for correct Authentication and valid Permissions

  try {
    sessionData = await getSession(req, res);
    isAllowed(sessionData, [{ scope: 'stops', action: 'create' }]);
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 4.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Ensure latest schema modifications are applied in the database

  try {
    await StopModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 6.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 6.
  // Validate req.body against schema

  try {
    req.body = StopValidation.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 7.
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
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Error setting zones.' });
  }

  // 8.
  // Check for uniqueness

  try {
    // Create a new document for this stop
    const newDocument = { ...StopDefault, ...req.body, zones: zoneIdsForThisStop, code: `${req.body.municipality.prefix}${generator({ length: 4, type: 'numeric' })}` };
    // The values that need to be unique are ['code'].
    while ((await StopModel.exists({ code: newDocument.code })) || ForbiddenStopIds.includes(newDocument.code)) {
      newDocument.code = `${req.body.municipality.prefix}${generator({ length: 4, type: 'numeric' })}`;
    }
    const createdDocument = await StopModel(newDocument).save();
    return await res.status(201).json(createdDocument);
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  //
}
