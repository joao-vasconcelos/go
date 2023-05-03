import * as turf from '@turf/turf';
import lineraw from './line';

export default function getStopsDistance() {
  const stops = [
    // [38.69827, -9.22764],
    // [38.69622, -9.19834],
    // [38.70287, -9.17324],
    // [38.7062, -9.15573],
    { lat: 38.70533, lon: -9.14394 },
  ];

  const line = turf.lineString(lineraw);

  //   var distance1 = turf.pointToLineDistance(turf.point([38.69827, -9.22764]), line, { units: 'kilometers' });
  //   var distance2 = turf.pointToLineDistance(turf.point([38.69622, -9.19834]), line, { units: 'kilometers' });
  //   var distance3 = turf.pointToLineDistance(turf.point([38.70287, -9.17324]), line, { units: 'kilometers' });
  //   var distance4 = turf.pointToLineDistance(turf.point([38.7062, -9.15573]), line, { units: 'kilometers' });
  //   var distance5 = turf.pointToLineDistance(turf.point([38.70533, -9.14394]), line, { units: 'kilometers' });

  //   console.log('------------------------');
  //   console.log('Algés (Estação)', distance1 * 1000);
  //   console.log('Estação Fluvial de Belém', distance2 * 1000);
  //   console.log('Alcântara Mar (Estação)', distance3 * 1000);
  //   console.log('Santos (Av. 24 de Julho)', distance4 * 1000);
  //   console.log('Cais do Sodré', distance5 * 1000);
  //   console.log('------------------------');

  var stop1 = turf.point([-9.227642, 38.698268]);
  var stop2 = turf.point([-9.19836, 38.696239]);
  var stop3 = turf.point([-9.173238, 38.702868]);
  var stop4 = turf.point([-9.155731, 38.706196]);
  var stop5 = turf.point([-9.14394, 38.70533]);

  var lengthFull = turf.length(line);
  var line1to2 = turf.lineSlice(stop1, stop2, line);
  var line2to3 = turf.lineSlice(stop2, stop3, line);
  var line3to4 = turf.lineSlice(stop3, stop4, line);
  var line4to5 = turf.lineSlice(stop4, stop5, line);

  var length1to2 = turf.length(line1to2, { units: 'kilometers' });
  var length2to3 = turf.length(line2to3, { units: 'kilometers' });
  var length3to4 = turf.length(line3to4, { units: 'kilometers' });
  var length4to5 = turf.length(line4to5, { units: 'kilometers' });

  console.log('------------------------');
  console.log('full line', lengthFull);
  console.log('length1to2', length1to2);
  console.log('length2to3', length2to3);
  console.log('length3to4', length3to4);
  console.log('length4to5', length4to5);
  console.log('------------------------');

  //
}

// function haversine(lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // radius of Earth in meters
//   const abc = toRadians(lat1);
//   const def = toRadians(lat2);
//   const ghi = toRadians(lat2 - lat1);
//   const jkl = toRadians(lon2 - lon1);

//   const a = Math.sin(ghi / 2) * Math.sin(ghi / 2) + Math.cos(abc) * Math.cos(def) * Math.sin(jkl / 2) * Math.sin(jkl / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const d = R * c;

//   return d;
// }

// function toRadians(degrees) {
//   return degrees * (Math.PI / 180);
// }

// function calculateDistancesAlongPath(stops, shapePoints) {
//   const distances = [];

//   for (let i = 0; i < stops.length - 1; i++) {
//     const stopA = stops[i];
//     const stopB = stops[i + 1];
//     let distance = 0;

//     for (let j = 0; j < shapePoints.length - 1; j++) {
//       const pointA = shapePoints[j];
//       const pointB = shapePoints[j + 1];
//       const segmentDistance = haversine(pointA.lat, pointA.lon, pointB.lat, pointB.lon);

//       if (isPointOnSegment(stopA, pointA, pointB) && isPointOnSegment(stopB, pointA, pointB)) {
//         // Both stops are on the same segment, so we can calculate the distance directly
//         const segmentRatio = (distance + haversine(stopA.lat, stopA.lon, stopB.lat, stopB.lon)) / segmentDistance;
//         distances.push(segmentRatio * segmentDistance);
//         break;
//       } else if (isPointOnSegment(stopA, pointA, pointB)) {
//         // Stop A is on this segment, so we need to calculate the distance from A to the end of the segment
//         const segmentRatio = (distance + haversine(stopA.lat, stopA.lon, pointB.lat, pointB.lon)) / segmentDistance;
//         distance = segmentRatio * segmentDistance;
//       } else if (isPointOnSegment(stopB, pointA, pointB)) {
//         // Stop B is on this segment, so we need to calculate the distance from the start of the segment to B
//         const segmentRatio = (distance + haversine(pointA.lat, pointA.lon, stopB.lat, stopB.lon)) / segmentDistance;
//         distances.push(segmentRatio * segmentDistance);
//         break;
//       } else {
//         // Neither stop is on this segment, so we just add the segment distance to the total distance
//         distance += segmentDistance;
//       }
//     }
//   }

//   return distances;
// }

// function isPointOnSegment(point, segmentStart, segmentEnd) {
//   const dxc = point.lon - segmentStart.lon;
//   const dyc = point.lat - segmentStart.lat;
//   const dxl = segmentEnd.lon - segmentStart.lon;
//   const dyl = segmentEnd.lat - segmentStart.lat;
//   const cross = dxc * dyl - dyc * dxl;

//   if (cross != 0) {
//     return false;
//   }

//   if (Math.abs(dxl) >= Math.abs(dyl)) {
//     if (dxl > 0) {
//       return segmentStart.lon <= point.lon && point.lon <= segmentEnd.lon;
//     } else {
//       return segmentEnd.lon <= point.lon && point.lon <= segmentStart.lon;
//     }
//   } else {
//     if (dyl > 0) {
//       return segmentStart.lat <= point.lat && point.lat <= segmentEnd.lat;
//     } else {
//       return segmentEnd.lat <= point.lat && point.lat <= segmentStart.lat;
//     }
//   }
// }
