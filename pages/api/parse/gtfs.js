import delay from '@/services/delay';
import AdmZip from 'adm-zip';
import formidable from 'formidable';
import Papa from 'papaparse';

/* * */
/* PARSE GTFS ARCHIVE */
/* This endpoint receives a GTFS archive and parses its contents into JSON. */
/* * */

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
    externalResolver: true,
  },
};

export default async function parseGTFS(req, res) {
  //
  await delay();

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
    const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });
    //
    form.parse(req, async (err, fields, files) => {
      // Abort if error
      if (err) return res.status(400).json({ message: err });
      // Setup AdmZip with archive location
      const zipArchive = new AdmZip(files.file.filepath);
      //
      const zipEntries = zipArchive.getEntries(); // an array of ZipEntry records

      //
      let gtfsRoutes = [];
      let gtfsTrips = [];
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
        if (zipEntry.entryName === 'shapes.txt') {
          const jsonData = Papa.parse(zipEntry.getData().toString('utf8'), { header: true, skipEmptyLines: true, dynamicTyping: false });
          //   const jsonDataDeduped = jsonData.data.filter((arr, index, self) => index === self.findIndex((t) => t.route_id === arr.route_id && t.direction_id === arr.direction_id && t.shape_id === arr.shape_id));
          jsonData.data.forEach((shapeData) => {
            const shapeId = shapeData.shape_id;
            const point = {
              shape_pt_lat: shapeData.shape_pt_lat,
              shape_pt_lon: shapeData.shape_pt_lon,
              shape_pt_sequence: shapeData.shape_pt_sequence,
              shape_dist_traveled: shapeData.shape_dist_travelled,
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
            // Create a new trip object with shape information
            let tripWithShape = {
              ...trip,
              shape: shape,
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
}
