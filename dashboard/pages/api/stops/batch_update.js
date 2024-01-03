import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { StopModel } from '@/schemas/Stop/model';
import { StopDefault } from '@/schemas/Stop/default';
import { ZoneModel } from '@/schemas/Zone/model';
import { MunicipalityModel } from '@/schemas/Municipality/model';
import * as turf from '@turf/turf';

/* * */
/* IMPORT STOPS */
/* Explanation needed. */
/* * */

let IS_TASK_RUNNING = false;

export default async function handler(req, res) {
  //

  if (IS_TASK_RUNNING) return await res.status(503).json({ message: `Task is already running.` });

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
  // Ensure latest schema modifications are applied in the database.

  try {
    await StopModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 6.
  // Update stops

  try {
    //

    IS_TASK_RUNNING = true;

    // 6.1.
    // Log the start of the operation
    const start = new Date();
    console.log(`⤷ Batch Update Stops: started at ${start}`);

    // 6.2.
    // Retrieve all Zones from the database
    const allZones = await ZoneModel.find();
    const allMunicipalities = await MunicipalityModel.find();

    // 6.3.
    // Build a hash map of the Municipalities array
    const allMunicipalitiesMap = {};
    allMunicipalities.forEach((municipality) => (allMunicipalitiesMap[municipality.code] = municipality));

    // 6.4.
    // Fetch all Stops from API v2
    console.log('⤷ Fetching all stops from API...');
    const allStopsResponse = await fetch('https://api.carrismetropolitana.pt/stops');
    const allStopsApi = await allStopsResponse.json();

    // 6.5.
    // Iterate through each available stop
    console.log(`⤷ Parsing ${allStopsApi.length} stops...`);
    const replaceOperations = allStopsApi.map((stopApi) => {
      //

      // 6.5.1.
      // Find out to which Zones this stop belongs to
      let zoneIdsForThisStop = [];
      zoneLoop: for (const zoneData of allZones) {
        // Skip if no geometry is set for this zone
        if (!zoneData.geojson?.geometry?.coordinates.length) continue zoneLoop;
        // Check if this stop is inside this zone boundary
        const isStopInThisZone = turf.booleanPointInPolygon([stopApi.lon, stopApi.lat], zoneData.geojson);
        // If it is, add this zone id to the stop
        if (isStopInThisZone) zoneIdsForThisStop.push(zoneData._id);
        //
      }

      // 6.5.2.
      // Find out to which Municipality this stop belongs to
      const matchedMunicipality = allMunicipalitiesMap[stopApi.municipality_id];
      if (!matchedMunicipality?._id) throw new Error(`Could not match Municipality for this stop. "stop_id ${stopApi.id}" "municipality_id ${stopApi.municipality_id}"`);

      // 6.5.3.
      // Format stop to match GO schema
      const formattedStop = {
        ...StopDefault,
        // General
        code: stopApi.id,
        name: stopApi.name,
        short_name: stopApi.short_name || '',
        tts_name: stopApi.tts_name || '',
        latitude: stopApi.lat,
        longitude: stopApi.lon,
        // Zoning
        zones: zoneIdsForThisStop,
        // Administrative
        municipality: matchedMunicipality._id,
        parish_code: stopApi.parish_id,
        parish_name: stopApi.parish_name,
        locality: stopApi.locality || '',
        // Services
        near_health_clinic: stopApi.facilities.includes('health_clinic'),
        near_hospital: stopApi.facilities.includes('hospital'),
        near_university: stopApi.facilities.includes('university'),
        near_school: stopApi.facilities.includes('school'),
        near_police_station: stopApi.facilities.includes('police_station'),
        near_fire_station: stopApi.facilities.includes('fire_station'),
        near_shopping: stopApi.facilities.includes('shopping'),
        near_historic_building: stopApi.facilities.includes('historic_building'),
        near_transit_office: stopApi.facilities.includes('transit_office'),
        // Intermodal Connections
        near_subway: stopApi.facilities.includes('subway'),
        near_light_rail: stopApi.facilities.includes('light_rail'),
        near_train: stopApi.facilities.includes('train'),
        near_boat: stopApi.facilities.includes('boat'),
        near_airport: stopApi.facilities.includes('airport'),
        near_bike_sharing: stopApi.facilities.includes('bike_sharing'),
        near_bike_parking: stopApi.facilities.includes('bike_parking'),
        near_car_parking: stopApi.facilities.includes('car_parking'),
      };

      console.log(`⤷ Parsed Stop ${formattedStop.code} zones: ${formattedStop.zones.length} municipality: ${matchedMunicipality.code}`);

      // 6.5.4.
      // Return the databse operation object for this stop
      return {
        replaceOne: {
          filter: { code: formattedStop.code },
          replacement: formattedStop,
          upsert: true,
        },
      };

      //
    });

    // 6.6.
    // Perform the database replace operations
    console.log('⤷ Replacing all stops with new data...');
    const replacedStops = await StopModel.bulkWrite(replaceOperations);
    console.log(`⤷ Modified ${replacedStops.modifiedCount} stops, ${replacedStops.upsertedCount} new.`);

    // 6.5.
    // Delete all Stops not present in the current update
    console.log('⤷ Deleting stale stops...');
    const thisBatchStopCodes = allStopsApi.map((stopApi) => stopApi.id);
    const deletedStaleStops = await StopModel.deleteMany({ code: { $nin: thisBatchStopCodes } });
    console.log(`⤷ Deleted ${deletedStaleStops.deletedCount} stale stops.`);

    const syncDuration = new Date() - start;
    console.log(`⤷ Complete. Operation took ${syncDuration / 1000} seconds.`);

    IS_TASK_RUNNING = false;

    //
  } catch (err) {
    console.log(err);
    IS_TASK_RUNNING = false;
    return await res.status(500).json({ message: 'Import Error' });
  }

  // 7.
  // Log progress
  console.log(`⤷ Done. Sending response to client...`);
  return await res.status(200).json('Update complete.');

  //
}
