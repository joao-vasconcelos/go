'use client';

/* * */

import OSMMap from '@/components/OSMMap/OSMMap';
import Pannel from '@/components/Pannel/Pannel';
import StopsExplorerPageHeader from '@/components/StopsExplorerPageHeader/StopsExplorerPageHeader';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';

/* * */

export default function StopsExplorerPage() {
	//

	//
	// A. Setup variables

	const stopsExplorerContext = useStopsExplorerContext();

	//
	// B. Handle actions

	const handleMapClick = (event) => {
		console.log(event.features[0]);
	};

	//
	// C. Transform data

	const mapData = useMemo(() => {
		// Create a GeoJSON object
		const geoJSON = {
			features: [],
			type: 'FeatureCollection',
		};

		// Loop through each stop in the collection and setup the feature to the GeoJSON object.
		if (stopsExplorerContext.list.items) {
			for (const stop of stopsExplorerContext.list.items) {
				geoJSON.features.push({
					geometry: {
						coordinates: [parseFloat(stop.longitude), parseFloat(stop.latitude)],
						type: 'Point',
					},
					properties: {
						_id: stop._id,
						code: stop.code,
						latitude: stop.latitude,
						longitude: stop.longitude,
						name: stop.name,
					},
					type: 'Feature',
				});
			}
		}
		// Return parsed data
		return geoJSON;
		//
	}, [stopsExplorerContext.list.items]);

	//
	// D. Render components

	return (
		<Pannel header={<StopsExplorerPageHeader />}>
			<OSMMap id="allStopsMap" interactiveLayerIds={['all-stops']} mapStyle={stopsExplorerContext.map.style} onClick={handleMapClick}>
				<Source data={mapData} id="all-stops" type="geojson">
					<Layer id="all-stops" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 6, 'circle-stroke-color': '#000000', 'circle-stroke-width': 2 }} source="all-stops" type="circle" />
				</Source>
			</OSMMap>
		</Pannel>
	);

	//
}
