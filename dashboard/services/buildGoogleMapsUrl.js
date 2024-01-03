/* * */

export default function buildGoogleMapsUrl({ type = 'map', lat, lon }) {
  //

  let baseUrl = 'http://maps.google.com/maps?';

  //
  if (type === 'map') {
  }

  //
  else if (type === 'streetview') {
    baseUrl += `q=&layer=c&cbll=${lat},${lon}&cbp=12,0,0,0,0`;
  }

  return baseUrl;

  //
}
