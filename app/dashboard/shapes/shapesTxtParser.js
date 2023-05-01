import Papa from 'papaparse';

/* * * * * */
/* CSV PARSE FOR SHAPES */
/* * */

function parseCsvAsync(csvData) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      worker: true,
      header: true, // Treat the first row as column headers
      dynamicTyping: false, // Keep everything as strings
      skipEmptyLines: true, // Skip any empty lines in the CSV
      complete: function (results) {
        resolve(results);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

export async function parseShapesCsv(csvString) {
  try {
    //
    // Parse the CSV string into an array of objects using PapaParse
    const parsedCsv = await parseCsvAsync(csvString);

    // Get the array of objects from the parsedCsv data
    const allShapes = parsedCsv.data.reduce((accumulator, row) => {
      // Get the shape object matching this row 'shape_id'
      let currentShape = accumulator.find((item) => item.shape_code === row.shape_id);
      // If no shape object exists, then create it
      if (!currentShape) {
        currentShape = {
          shape_code: row.shape_id,
          points: [],
          geojson: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [],
            },
          },
        };
        accumulator.push(currentShape);
      }
      // Append to the points array of the current shape this row values
      currentShape.points.push({
        shape_pt_lat: row.shape_pt_lat,
        shape_pt_lon: row.shape_pt_lon,
        shape_pt_sequence: row.shape_pt_sequence,
        shape_dist_traveled: row.shape_dist_traveled,
      });
      // Return the accumulator for the next iteration
      return accumulator;
    }, []);

    // Sort the points array each shape by shape_pt_sequence
    for (const currentShape of allShapes) {
      currentShape.shape_points_count = currentShape.points.length;
      currentShape.shape_distance = currentShape.points[currentShape.points.length - 1].shape_dist_traveled;
      currentShape.points.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence);
      currentShape.geojson.geometry.coordinates = currentShape.points.map((point) => [parseFloat(point.shape_pt_lat), parseFloat(point.shape_pt_lon)]);
    }

    // Return the shapes to the caller
    return allShapes;

    //
  } catch (err) {
    console.log('Error parsing shapes', err);
  }
}

export default async function shapesTxtParser(files) {
  //
  let allParsedShapes = [];
  // For each file
  for (const currentFile of files) {
    // Parse the shapes in the file
    const shapesFromFile = await parseShapesCsv(currentFile);
    // For each parsed shape in the file
    for (const currentShape of shapesFromFile) {
      // For each parsed shape in the file
      allParsedShapes.push(currentShape);
      //
    }
  }

  return allParsedShapes;
}
