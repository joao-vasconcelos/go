/* * */

import { StopModel } from '@/schemas/Stop/model';
import tts from '@carrismetropolitana/tts';

/* * */

export default async function syncAllStopsWithDatasets() {
  //

  try {
    //

    // 1.
    // Log the start of the operation

    const start = new Date();
    console.log(`⤷ Sync Stops with Datasets API - started at ${start}`);

    // 2.
    // Fetch all Stops from the database

    const allStopsData = await StopModel.find();

    // 3.
    // Fetch the Datasets API

    const allDatasetsFacilitiesEncmResponse = await fetch('https://api.carrismetropolitana.pt/datasets/facilities/encm');
    const allDatasetsFacilitiesEncmData = await allDatasetsFacilitiesEncmResponse.json();
    const allDatasetsFacilitiesEncmSet = new Set(allDatasetsFacilitiesEncmData.flatMap((item) => item.stops));

    const allDatasetsFacilitiesSchoolsResponse = await fetch('https://api.carrismetropolitana.pt/datasets/facilities/schools');
    const allDatasetsFacilitiesSchoolsData = await allDatasetsFacilitiesSchoolsResponse.json();
    const allDatasetsFacilitiesSchoolsSet = new Set(allDatasetsFacilitiesSchoolsData.flatMap((item) => item.stops));

    const allDatasetsConnectionsBoatStationsResponse = await fetch('https://api.carrismetropolitana.pt/datasets/connections/boat_stations');
    const allDatasetsConnectionsBoatStationsData = await allDatasetsConnectionsBoatStationsResponse.json();
    const allDatasetsConnectionsBoatStationsSet = new Set(allDatasetsConnectionsBoatStationsData.flatMap((item) => item.stops));

    const allDatasetsConnectionsLightRailStationsResponse = await fetch('https://api.carrismetropolitana.pt/datasets/connections/light_rail_stations');
    const allDatasetsConnectionsLightRailStationsData = await allDatasetsConnectionsLightRailStationsResponse.json();
    const allDatasetsConnectionsLightRailStationsSet = new Set(allDatasetsConnectionsLightRailStationsData.flatMap((item) => item.stops));

    const allDatasetsConnectionsSubwayStationsResponse = await fetch('https://api.carrismetropolitana.pt/datasets/connections/subway_stations');
    const allDatasetsConnectionsSubwayStationsData = await allDatasetsConnectionsSubwayStationsResponse.json();
    const allDatasetsConnectionsSubwayStationsSet = new Set(allDatasetsConnectionsSubwayStationsData.flatMap((item) => item.stops));

    const allDatasetsConnectionsTrainStationsResponse = await fetch('https://api.carrismetropolitana.pt/datasets/connections/train_stations');
    const allDatasetsConnectionsTrainStationsData = await allDatasetsConnectionsTrainStationsResponse.json();
    const allDatasetsConnectionsTrainStationsSet = new Set(allDatasetsConnectionsTrainStationsData.flatMap((item) => item.stops));

    // 4.
    // Iterate through each available stop

    for (const stopData of allStopsData) {
      //
      stopData.near_transit_office = allDatasetsFacilitiesEncmSet.has(stopData.code) ? true : false;
      stopData.near_school = allDatasetsFacilitiesSchoolsSet.has(stopData.code) ? true : false;
      //
      stopData.near_boat = allDatasetsConnectionsBoatStationsSet.has(stopData.code) ? true : false;
      stopData.near_light_rail = allDatasetsConnectionsLightRailStationsSet.has(stopData.code) ? true : false;
      stopData.near_subway = allDatasetsConnectionsSubwayStationsSet.has(stopData.code) ? true : false;
      stopData.near_train = allDatasetsConnectionsTrainStationsSet.has(stopData.code) ? true : false;
      //
      const stopModalConnections = {
        subway: stopData.near_subway,
        light_rail: stopData.near_light_rail,
        train: stopData.near_train,
        boat: stopData.near_boat,
        airport: stopData.near_airport,
        bike_sharing: stopData.near_bike_sharing,
        bike_parking: stopData.near_bike_parking,
        car_parking: stopData.near_car_parking,
      };
      //
      stopData.tts_name = tts.makeText(stopData.name, stopModalConnections).trim();
      //
      await stopData.save();
      //
    }

    // 5.
    // Log progress

    const syncDuration = new Date() - start;
    console.log(`⤷ Complete. Operation took ${syncDuration / 1000} seconds.`);

    //
  } catch (error) {
    console.log(error);
  }

  //
}
