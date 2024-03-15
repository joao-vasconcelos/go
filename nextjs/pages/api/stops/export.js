/* * */

import Papa from 'papaparse';
import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { StopModel } from '@/schemas/Stop/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;
  let foundDocuments;

  // 2.
  // Get session data

  try {
    sessionData = await getSession(req, res);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'stops', action: 'view' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // List all documents

  try {
    foundDocuments = await StopModel.find();
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    foundDocuments = foundDocuments.sort((a, b) => collator.compare(a.code, b.code));
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Stops.' });
  }

  // 5.
  // Prepare the fields that are to be exported

  try {
    foundDocuments = foundDocuments.map((document) => ({
      // General
      stop_id: document.code,
      stop_name: document.name,
      stop_lat: document.latitude,
      stop_lon: document.longitude,
      //
      stop_code: document.code,
      stop_short_name: document.short_name,
      tts_stop_name: document.tts_name,
      // Administrative
      //   region_id: document.region_id,
      //   region_name: document.region_name,
      //   district_id: document.district_id,
      //   district_name: document.district_name,
      //   municipality_id: document.municipality_id,
      //   municipality_name: document.municipality_name,
      //   parish_id: document.parish_id,
      //   parish_name: document.parish_name,
      locality: document.locality || '',
      jurisdiction: document.jurisdiction || '',
      //
      //   areas: 'not-yet-available',
      //
      // GTFS
      location_type: '0',
      //   platform_code: '',
      //   parent_station: '',
      stop_url: `https://on.carrismetropolitana.pt/stops/${document.code}`,
      // Accessibility
      wheelchair_boarding: '0',
      // Services
      near_health_clinic: document.near_health_clinic ? '1' : '0',
      near_hospital: document.near_hospital ? '1' : '0',
      near_university: document.near_university ? '1' : '0',
      near_school: document.near_school ? '1' : '0',
      near_police_station: document.near_police_station ? '1' : '0',
      near_fire_station: document.near_fire_station ? '1' : '0',
      near_shopping: document.near_shopping ? '1' : '0',
      near_historic_building: document.near_historic_building ? '1' : '0',
      near_transit_office: document.near_transit_office ? '1' : '0',
      // Intermodal Connections
      subway: document.near_subway ? '1' : '0',
      light_rail: document.near_light_rail ? '1' : '0',
      train: document.near_train ? '1' : '0',
      boat: document.near_boat ? '1' : '0',
      airport: document.near_airport ? '1' : '0',
      bike_sharing: document.near_bike_sharing ? '1' : '0',
      bike_parking: document.near_bike_parking ? '1' : '0',
      car_parking: document.near_car_parking ? '1' : '0',
    }));
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot list Stops.' });
  }

  // 6.
  // Read the previously zipped archive from the filesystem and pipe it to the response.

  try {
    console.log(foundDocuments);
    const parsedCsvData = Papa.unparse(foundDocuments, { skipEmptyLines: 'greedy', newline: '\n', header: true });
    await res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename=stops.txt` }).send(parsedCsvData);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create CSV from found documents.' });
  }

  //
}
