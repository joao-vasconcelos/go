import * as turf from '@turf/turf';

export default function calculateDistanceBetweenStops(startStop, endStop, shapeCoordinates) {
  //

  // 1. Define the objects

  const shapeLine = turf.lineString(shapeCoordinates);

  const startStopPoint = startStop ? turf.point(startStop) : turf.point(shapeCoordinates[0]);
  const endStopPoint = endStop ? turf.point(endStop) : turf.point(shapeCoordinates[shapeCoordinates.length - 1]);

  // 2. Split the line at the points

  const lineSegmentBetweenStops = turf.lineSlice(startStopPoint, endStopPoint, shapeLine);

  // 3. Return the segment length in meters

  return turf.length(lineSegmentBetweenStops, { units: 'kilometers' }) * 1000;

  //
}
