/* * */

import AdmZip from 'adm-zip';
import formidable from 'formidable';
import Papa from 'papaparse';

/* * */

export const config = { api: { bodyParser: false, externalResolver: true } }; // Disable body parsing, consume as stream

/* * */

export default async function parseGTFS(req, res) {
  //

  //
  // 0. Refuse request if not POST

  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  //
  // 1. Parse FormData in the request and unzip files

  try {
    //
    const form = formidable({ keepExtensions: true });
    //
    form.parse(req, async (err, fields, files) => {
      // Abort if error
      if (err) return res.status(400).json({ message: err });
      // Setup AdmZip with archive location
      const zipArchive = new AdmZip(files.file[0].filepath);
      //
      const zipEntries = zipArchive.getEntries(); // an array of ZipEntry records
      //
      let gtfsRoutes = [];
      let gtfsTrips = [];
      let gtfsStopTimes = [];
      let gtfsShapes = [];

      for (const zipEntry of zipEntries) {
        //
        if (zipEntry.entryName === 'routes.txt') {
          const jsonData = Papa.parse(zipEntry.getData().toString('utf8'), { header: true, skipEmptyLines: true, dynamicTyping: false });
          gtfsRoutes = jsonData.data;
        }
        //
        if (zipEntry.entryName === 'trips.txt') {
          const jsonData = Papa.parse(zipEntry.getData().toString('utf8'), { header: true, skipEmptyLines: true, dynamicTyping: false });
          const jsonDataDeduped = jsonData.data.filter((arr, index, self) => index === self.findIndex((t) => t.route_id === arr.route_id && t.direction_id === arr.direction_id && t.shape_id === arr.shape_id));
          gtfsTrips = jsonDataDeduped;
        }
        //
        if (zipEntry.entryName === 'stop_times.txt') {
          const jsonData = Papa.parse(zipEntry.getData().toString('utf8'), { header: true, skipEmptyLines: true, dynamicTyping: false });
          jsonData.data.forEach((stopTimesData) => {
            const tripId = stopTimesData.trip_id;
            const pathSequence = {
              stop_id: stopTimesData.stop_id,
              stop_sequence: stopTimesData.stop_sequence,
              arrival_time: stopTimesData.arrival_time,
              departure_time: stopTimesData.departure_time,
              shape_dist_traveled: stopTimesData.shape_dist_traveled,
            };

            const existingStopTime = gtfsStopTimes.find((stopTimes) => stopTimes.trip_id === tripId);

            if (existingStopTime) {
              existingStopTime.path.push(pathSequence);
            } else {
              gtfsStopTimes.push({
                trip_id: tripId,
                path: [pathSequence],
              });
            }
          });
        }
        //
        if (zipEntry.entryName === 'shapes.txt') {
          const jsonData = Papa.parse(zipEntry.getData().toString('utf8'), { header: true, skipEmptyLines: true, dynamicTyping: false });
          jsonData.data.forEach((shapeData) => {
            const shapeId = shapeData.shape_id;
            const point = {
              shape_pt_lat: shapeData.shape_pt_lat,
              shape_pt_lon: shapeData.shape_pt_lon,
              shape_pt_sequence: shapeData.shape_pt_sequence,
              shape_dist_traveled: shapeData.shape_dist_traveled,
            };

            const existingShape = gtfsShapes.find((shape) => shape.shape_id === shapeId);

            if (existingShape) {
              existingShape.points.push(point);
            } else {
              gtfsShapes.push({
                shape_id: shapeId,
                points: [point],
              });
            }
          });
        }
        //
      }

      let gtfsFinal = [];

      // Loop through each route
      for (let i = 0; i < gtfsRoutes.length; i++) {
        let route = gtfsRoutes[i];
        let trips = [];

        // Find all trips associated with the current route
        for (let j = 0; j < gtfsTrips.length; j++) {
          let trip = gtfsTrips[j];
          if (trip.route_id === route.route_id) {
            // Find the shape associated with the trip
            let shape = gtfsShapes.find((shape) => shape.shape_id === trip.shape_id);
            // Sort the shape points
            shape.points = shape.points.sort((a, b) => a.shape_pt_sequence > b.shape_pt_sequence);
            // Find the path associated with the trip
            let stopTime = gtfsStopTimes.find((stopTime) => stopTime.trip_id === trip.trip_id);
            // Convert the shapes into meters, if they are in km (by checking the last point of the shape)
            const lastShapePoint = shape.points[shape.points.length - 1];
            if (Number(lastShapePoint.shape_dist_traveled) < 1000) {
              shape.points = shape.points.map((point) => ({ ...point, shape_dist_traveled: point.shape_dist_traveled * 1000 }));
              stopTime.path = stopTime.path.map((st) => ({ ...st, shape_dist_traveled: st.shape_dist_traveled * 1000 }));
            }
            // Create a new trip object with shape information
            let tripWithShape = {
              ...trip,
              shape: shape,
              path: stopTime.path,
            };
            trips.push(tripWithShape);
          }
        }

        // Create an object with the route information and associated trips
        let routeWithTrips = {
          ...route,
          trips: trips,
        };

        gtfsFinal.push(routeWithTrips);
      }

      return res.status(200).json(gtfsFinal);
    });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  //
}
