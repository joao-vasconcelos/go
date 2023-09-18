import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { StopModel } from '@/schemas/Stop/model';
import { ZoneModel } from '@/schemas/Zone/model';
import { MunicipalityModel } from '@/schemas/Municipality/model';
import * as turf from '@turf/turf';

/* * */
/* IMPORT STOPS */
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

    // 6.0.
    // Initate a temporary variable to hold updated Stops
    let updatedStopIds = [];

    // 6.1.
    // Retrieve Zones and Municipalities from the database
    const allZones = await ZoneModel.find();
    const allMunicipalities = await MunicipalityModel.find();

    // 6.2.
    // Fetch all Stops from API v2
    const allStopsRes = await fetch('https://api.carrismetropolitana.pt/stops');
    const allStopsApi = await allStopsRes.json();

    // 6.3.
    // Iterate through each available stop
    for (const stopApi of allStopsApi) {
      //

      // 6.3.1.
      // Find out to which Zones this stop belongs to
      let zoneIdsForThisStop = [];
      zoneLoop: for (const zoneData of allZones) {
        // Skip if no geometry is set for this zone
        if (!zoneData.geojson?.geometry?.coordinates.length) continue zoneLoop;
        // Setup turf point for this stop
        const turfPoint = turf.point([stopApi.lon, stopApi.lat]);
        // Check if this stop is inside this zone boundary
        const isStopInThisZone = turf.booleanPointInPolygon(turfPoint, zoneData.geojson);
        // If it is, add this zone id to the stop
        if (isStopInThisZone) zoneIdsForThisStop.push(zoneData._id);
        //
      }

      // 6.3.2.
      // Find out to which Municipality this stop belongs to
      const matchedMunicipality = allMunicipalities.find((item) => item.code === stopApi.municipality_id);
      const municipalityIdForThisStop = matchedMunicipality ? matchedMunicipality._id : null;

      // 6.3.3.
      // Format stop to match GO schema
      const formattedStop = {
        // General
        code: stopApi.id,
        name: stopApi.name,
        short_name: stopApi.short_name,
        tts_name: stopApi.tts_name,
        latitude: stopApi.lat,
        longitude: stopApi.lon,
        // Zoning
        zones: zoneIdsForThisStop,
        // Administrative
        municipality: municipalityIdForThisStop,
        parish_code: stopApi.parish_id,
        parish_name: stopApi.parish_name,
        locality: stopApi.locality,
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

      // 6.3.4.
      // Update the stop
      const updatedStopDocument = await StopModel.findOneAndUpdate({ code: stopApi.id }, formattedStop, { new: true, upsert: true });

      // 6.3.5.
      // Save this stop_id to the set to delete any dangling stops
      updatedStopIds.push(updatedStopDocument._id);

      // 6.3.6.
      // Log progress
      console.log(`⤷ Updated Stop ${formattedStop.code}.`);

      //
    }

    // 6.4.
    // Delete all Stops not present in the current update
    const deletedStaleStops = await StopModel.deleteMany({ _id: { $nin: updatedStopIds } });
    console.log(`⤷ Deleted ${deletedStaleStops.deletedCount} stale Stops.`);

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  // 7.
  // Log progress
  console.log('⤷ Done. Sending response to client...');
  return await res.status(200).json('Update complete.');

  //
}
