/* * */

export default function buildGoogleMapsUrl({ lat, lon, type = 'map' }) {
	//

	let baseUrl = 'http://maps.google.com/maps?';

	//
	if (type === 'map') {
		baseUrl += `q=&layer=c&cbll=${lat},${lon}&cbp=12,0,0,0,0`;
	}

	//
	else if (type === 'streetview') {
		baseUrl += `q=&layer=c&cbll=${lat},${lon}&cbp=12,0,0,0,0`;
	}

	return baseUrl;

	//
}
