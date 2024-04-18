/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
import * as turf from '@turf/turf';
import { ZoneModel } from '@/schemas/Zone/model';
import Papa from 'papaparse';
import fs from 'fs';
import { StopOptions } from '@/schemas/Stop/options';
import { MunicipalityModel } from '@/schemas/Municipality/model';
import tts from '@carrismetropolitana/tts';

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
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Ensure latest schema modifications are applied in the database.

  try {
    await PatternModel.syncIndexes();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 5.
  // Update deletedStops

  try {
    //

    // 6.2.
    // Retrieve all Zones from the database
    const allZones = await ZoneModel.find();
    const allMunicipalities = await MunicipalityModel.find();

    // 6.3.
    // Build a hash map of the Municipalities array
    const allMunicipalitiesMap = {};
    allMunicipalities.forEach((municipality) => (allMunicipalitiesMap[municipality.code] = municipality));

    const deletedStopsRaw = fs.readFileSync('/app/pages/api/configs/imports/all_stops.csv', { encoding: 'utf8' });
    // const deletedStopsRaw = fs.readFileSync('./pages/api/configs/imports/all_stops.csv', { encoding: 'utf8' });

    const parsedAllStops = Papa.parse(deletedStopsRaw, { header: true, delimiter: ',' });

    // 5.2.
    // Iterate through each available line
    for (const importedStopData of parsedAllStops.data) {
      //

      const parsedStopData = {
        code: importedStopData.stop_id,
      };

      parsedStopData.name = importedStopData.stop_name;
      parsedStopData.latitude = importedStopData.stop_lat;
      parsedStopData.longitude = importedStopData.stop_lon;
      parsedStopData.longitude = importedStopData.stop_lon;
      //
      parsedStopData.name_new = importedStopData.stop_name_new;
      //
      parsedStopData.locality = importedStopData.locality;

      //
      //
      //
      //
      //

      //
      // Automatic transformations

      if (parsedStopData.name_new.length) {
        // Copy the name first
        let shortenedStopName = parsedStopData.name_new;
        // Shorten the stop name
        StopOptions.name_abbreviations
          .filter((abbreviation) => abbreviation.enabled)
          .forEach((abbreviation) => {
            shortenedStopName = shortenedStopName.replace(abbreviation.phrase, abbreviation.replacement);
          });
        // Save the new name
        parsedStopData.short_name = shortenedStopName;
      } else {
        parsedStopData.name_new = 'a definir';
        parsedStopData.short_name = 'a definir';
      }

      parsedStopData.tts_name = tts.makeText(parsedStopData.name);

      // Find out to which Zones this stop belongs to
      let zoneIdsForThisStop = [];
      zoneLoop: for (const zoneData of allZones) {
        // Skip if no geometry is set for this zone
        if (!zoneData.geojson?.geometry?.coordinates.length) continue zoneLoop;
        // Check if this stop is inside this zone boundary
        const isStopInThisZone = turf.booleanPointInPolygon([importedStopData.stop_lon, importedStopData.stop_lat], zoneData.geojson);
        // If it is, add this zone id to the stop
        if (isStopInThisZone) zoneIdsForThisStop.push(zoneData._id);
        //
      }
      parsedStopData.zones = zoneIdsForThisStop;

      // Find out to which Zones this stop belongs to
      municipalityLoop: for (const municipalityData of allMunicipalities) {
        // Skip if no geometry is set for this zone
        if (!municipalityData.geojson?.geometry?.coordinates.length) continue municipalityLoop;
        // Check if this stop is inside this zone boundary
        const isStopInThisMunicipality = turf.booleanPointInPolygon([importedStopData.stop_lon, importedStopData.stop_lat], municipalityData.geojson);
        // If it is, add this zone id to the stop
        if (isStopInThisMunicipality) parsedStopData.municipality = municipalityData._id;
        //
      }

      //
      //
      //
      //
      //
      //

      //
      await StopModel.replaceOne({ code: parsedStopData.code }, parsedStopData, { upsert: true });

      // 5.2.6.
      // Log progress
      console.log(`⤷ Imported Stop  ${parsedStopData.code}`);

      //
    }

    console.log('Finished. Check these patterns:');

    // 6.5.
    // Delete all Stops not present in the current update
    console.log('⤷ Deleting stale stops...');
    const thisBatchStopCodes = parsedAllStops.data.map((parsedStopData) => parsedStopData.stop_id);
    const deletedStaleStops = await StopModel.deleteMany({ code: { $nin: thisBatchStopCodes } });
    console.log(`⤷ Deleted ${deletedStaleStops.deletedCount} stale stops.`);

    //
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Import Error' });
  }

  // 6.
  // Log progress
  console.log('⤷ Done. Sending response to client...');
  return await res.status(200).json('Import complete.');

  //
}
