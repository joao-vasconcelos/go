/* * */

import Papa from 'papaparse';
import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { StopModel } from '@/schemas/Stop/model';
import { MunicipalityOptions } from '@/schemas/Municipality/options';
import { PatternModel } from '@/schemas/Pattern/model';
import { LineModel } from '@/schemas/Line/model';
import { AgencyModel } from '@/schemas/Agency/model';
import tts from '@carrismetropolitana/tts';

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
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'stops', action: 'export' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // List all documents

  try {
    foundDocuments = await StopModel.find().populate('municipality', 'code name district region').lean();
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    foundDocuments = foundDocuments.sort((a, b) => collator.compare(a.code, b.code));
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot list Stops.' });
  }

  // 5.
  // Prepare the fields that are to be exported

  try {
    //

    const allPatternsData = await PatternModel.find({}, '_id code parent_line path').populate([{ path: 'path.stop' }, { path: 'parent_line', populate: { path: 'agency' } }]);
    const allPatternsDataFormatted = allPatternsData.map((item) => ({ _id: item._id, code: item.code, agency_code: item.parent_line?.agency?.code, stop_codes: item.path?.map((pathItem) => pathItem.stop?.code) }));

    const allRegionsMap = MunicipalityOptions.region.reduce((map, { value, label }) => ((map[value] = label), map), {});
    const allDistrictsMap = MunicipalityOptions.district.reduce((map, { value, label }) => ((map[value] = label), map), {});

    foundDocuments = foundDocuments.map((document) => {
      const thisStopModalConnections = {
        subway: document.near_subway,
        light_rail: document.near_light_rail,
        train: document.near_train,
        boat: document.near_boat,
        airport: document.near_airport,
        bike_sharing: document.near_bike_sharing,
        bike_parking: document.near_bike_parking,
        car_parking: document.near_car_parking,
      };
      const thisStopAgencyCodes = Array.from(new Set(allPatternsDataFormatted.filter((item) => item.stop_codes.includes(document.code)).map((item) => item.agency_code))).join('|');
      return {
        // General
        stop_id: document.code,
        stop_name: document.name,
        stop_lat: document.latitude.toFixed(6),
        stop_lon: document.longitude.toFixed(6),
        //
        stop_code: document.code,
        stop_short_name: '', //document.short_name,
        tts_stop_name: tts.makeText(document.name, thisStopModalConnections),
        // Operation
        areas: thisStopAgencyCodes,
        // Administrative
        region_id: document.municipality.region,
        region_name: allRegionsMap[document.municipality.region],
        district_id: document.municipality.district,
        district_name: allDistrictsMap[document.municipality.district],
        municipality_id: document.municipality.code,
        municipality_name: document.municipality.name,
        parish_id: '',
        parish_name: '',
        locality: document.locality || '',
        jurisdiction: document.jurisdiction || '',
        // GTFS
        location_type: '0',
        platform_code: '',
        parent_station: '',
        stop_url: `https://on.carrismetropolitana.pt/stops/${document.code}`,
        // Accessibility
        wheelchair_boarding: '0',
        // Facilities
        near_health_clinic: document.near_health_clinic ? '1' : '0',
        near_hospital: document.near_hospital ? '1' : '0',
        near_university: document.near_university ? '1' : '0',
        near_school: document.near_school ? '1' : '0',
        near_police_station: document.near_police_station ? '1' : '0',
        near_fire_station: document.near_fire_station ? '1' : '0',
        near_shopping: document.near_shopping ? '1' : '0',
        near_historic_building: document.near_historic_building ? '1' : '0',
        near_transit_office: document.near_transit_office ? '1' : '0',
        // Connections
        subway: document.near_subway ? '1' : '0',
        light_rail: document.near_light_rail ? '1' : '0',
        train: document.near_train ? '1' : '0',
        boat: document.near_boat ? '1' : '0',
        airport: document.near_airport ? '1' : '0',
        bike_sharing: document.near_bike_sharing ? '1' : '0',
        bike_parking: document.near_bike_parking ? '1' : '0',
        car_parking: document.near_car_parking ? '1' : '0',
        //
      };
    });
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot list Stops.' });
  }

  // 6.
  // Read the previously zipped archive from the filesystem and pipe it to the response.

  try {
    const parsedCsvData = Papa.unparse(foundDocuments, { skipEmptyLines: 'greedy', newline: '\n', header: true });
    await res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename=stops.txt` }).send(parsedCsvData);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot create CSV from found documents.' });
  }

  //
}
