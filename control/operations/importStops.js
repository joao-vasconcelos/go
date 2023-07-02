const StopModel = require('../schemas/Stop');
const ZoneModel = require('../schemas/Zone');
const MunicipalityModel = require('../schemas/Municipality');

/* * */
/* UPDATE STOP */
/* Explanation needed. */
/* * */

module.exports = async function importStops() {
  //

  const allZones = await ZoneModel.find({});
  const allMunicipalities = await MunicipalityModel.find({});

  const zoneCodes = {
    '01': 'ALCOCHETE',
    '02': 'ALMADA',
    '03': 'AMADORA',
    '04': 'BARREIRO',
    '05': 'CASCAIS',
    '06': 'LISBOA',
    '07': 'LOURES',
    '08': 'MAFRA',
    '09': 'MOITA',
    10: 'MONTIJO',
    11: 'ODIVELAS',
    12: 'OEIRAS',
    13: 'PALMELA',
    14: 'SEIXAL',
    15: 'SESIMBRA',
    16: 'SETUBAL',
    17: 'SINTRA',
    18: 'VFX',
    19: 'COMP-IR',
    20: 'COMP-IR',
    aml: 'AML',
  };

  // Fetch all Stops from API v2
  const allStopsRes = await fetch('https://schedules-test.carrismetropolitana.pt/api/stops');
  const allStopsApi = await allStopsRes.json();

  for (const stopApi of allStopsApi) {
    //

    if (!stopApi.code.startsWith('20')) continue;

    // Find out Zones
    let zoneIdsForThisStop = [];
    let zoneCodesForThisStop = [zoneCodes.aml, zoneCodes[stopApi.code.substring(0, 2)]];
    for (const zoneCodeForStop of zoneCodesForThisStop) {
      const foundZoneDocument = allZones.find((item) => item.code === zoneCodeForStop);
      zoneIdsForThisStop.push(foundZoneDocument._id);
    }
    // Find out Municipalities
    let municipalityIdForThisStop = allMunicipalities.find((item) => item.code === stopApi.municipality_id);

    // Format stop to match GO schema
    const formattedStop = {
      // General
      code: stopApi.code,
      name: stopApi.name,
      short_name: stopApi.short_name,
      tts_name: stopApi.tts_name,
      latitude: stopApi.latitude,
      longitude: stopApi.longitude,
      // Zoning
      zones: zoneIdsForThisStop,
      // Administrative
      region_code: stopApi.region_id,
      region_name: stopApi.region_name,
      district_code: stopApi.district_id,
      district_name: stopApi.district_name,
      municipality: municipalityIdForThisStop,
      parish_code: stopApi.parish_id,
      parish_name: stopApi.parish_name,
      locality: stopApi.locality,
      // Services
      near_health_clinic: stopApi.near_services.includes('near_health_clinic'),
      near_hospital: stopApi.near_services.includes('near_hospital'),
      near_university: stopApi.near_services.includes('near_university'),
      near_school: stopApi.near_services.includes('near_school'),
      near_police_station: stopApi.near_services.includes('near_police_station'),
      near_fire_station: stopApi.near_services.includes('near_fire_station'),
      near_shopping: stopApi.near_services.includes('near_shopping'),
      near_historic_building: stopApi.near_services.includes('near_historic_building'),
      near_transit_office: stopApi.near_services.includes('near_transit_office'),
      // Intermodal Connections
      subway: stopApi.intermodal_connections.includes('subway'),
      light_rail: stopApi.intermodal_connections.includes('light_rail'),
      train: stopApi.intermodal_connections.includes('train'),
      boat: stopApi.intermodal_connections.includes('boat'),
      airport: stopApi.intermodal_connections.includes('airport'),
      bike_sharing: stopApi.intermodal_connections.includes('bike_sharing'),
      bike_parking: stopApi.intermodal_connections.includes('bike_parking'),
      car_parking: stopApi.intermodal_connections.includes('car_parking'),
    };

    await StopModel.findOneAndUpdate({ code: stopApi.code }, formattedStop, { new: true, upsert: true });

    console.log(`Updated Stop ${stopApi.code}.`);
  }
  console.log('Done.');

  //
};
