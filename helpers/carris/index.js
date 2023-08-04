// https://gateway.carris.pt/gateway/gtfs/api/v2.8/GTFS/realtime/vehiclepositions

const protobuf = require('protobufjs');
const Papa = require('papaparse');
const fs = require('fs');
const gtfsRealtime = protobuf.loadSync(`./services/gtfs-realtime.proto`);
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

(async function parseGtfsRt() {
  // const gtfsRealtime = await protobuf.load('./services/gtfs-realtime.proto');
  const carrisGtfsResponse = await fetch('https://gateway.carris.pt/gateway/gtfs/api/v2.8/GTFS/realtime/vehiclepositions');
  const carrisGtfs = await carrisGtfsResponse.arrayBuffer();
  const pbf = new Uint8Array(carrisGtfs);
  var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(pbf);
  // const FeedMessage = gtfsRealtime.root.lookupType('transit_realtime.FeedMessage');
  // const message = FeedMessage.decode(carrisGtfs);
  // Append the csv string to the file
  fs.writeFileSync(`resultCarris.json`, JSON.stringify(feed));

  let finalCsvFile = [['id', 'tripId', 'scheduleRelationship', 'routeId', 'directionId', 'latitude', 'longitude', 'currentStopSequence', 'currentStatus', 'timestamp', 'stopId', 'id', 'licensePlate']];

  for (const entity of feed.entity) {
    //

    let thisLine = [];

    thisLine.push(entity.id);
    thisLine.push(entity.vehicle.trip.tripId);
    thisLine.push(entity.vehicle.trip.scheduleRelationship);
    thisLine.push(entity.vehicle.trip.routeId);
    thisLine.push(entity.vehicle.trip.directionId);
    thisLine.push(entity.vehicle.position.latitude);
    thisLine.push(entity.vehicle.position.longitude);
    thisLine.push(entity.vehicle.currentStopSequence);
    thisLine.push(entity.vehicle.currentStatus);
    thisLine.push(entity.vehicle.timestamp);
    thisLine.push(entity.vehicle.stopId);
    thisLine.push(entity.vehicle.vehicle.id);
    thisLine.push(entity.vehicle.vehicle.licensePlate);

    finalCsvFile.push(thisLine);
  }

  let csvString = Papa.unparse(finalCsvFile);
  fs.writeFileSync(`resultCarris.csv`, csvString);
  console.log(feed);
})();
