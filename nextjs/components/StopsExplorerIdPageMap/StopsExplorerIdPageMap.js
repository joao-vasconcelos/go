'use client';

/* * */

import OSMMap from '@/components/OSMMap/OSMMap';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { useMemo } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';

/* * */

export default function StopsExplorerIdPageMap() {
	//

	//
	// A. Setup variables

	const stopsExplorerContext = useStopsExplorerContext();
	const { singleStopMap } = useMap();

	//
	// E. Transform data

	const mapData = useMemo(() => {
		// Create a GeoJSON object
		const geoJSON = {
			geometry: {},
			properties: {},
			type: 'Feature',
		};

		// Loop through each stop in the collection and setup the feature to the GeoJSON object.
		if (stopsExplorerContext.form.values.latitude && stopsExplorerContext.form.values.longitude) {
			geoJSON.geometry = {
				coordinates: [parseFloat(stopsExplorerContext.form.values.longitude), parseFloat(stopsExplorerContext.form.values.latitude)],
				type: 'Point',
			};
			geoJSON.properties = {
				code: stopsExplorerContext.form.values.code,
				latitude: stopsExplorerContext.form.values.latitude,
				longitude: stopsExplorerContext.form.values.longitude,
				name: stopsExplorerContext.form.values.name,
			};
			singleStopMap?.flyTo({
				center: geoJSON.geometry.coordinates,
				duration: 2000,
				zoom: 14,
			});
		}
		// Return parsed data
		return geoJSON;
		// Only run if stopsExplorerContext.form.values changes
	}, [singleStopMap, stopsExplorerContext.form.values]);

	//
	// C. Render components

	return (
		<div style={{ height: 400, minHeight: 400 }}>
			<OSMMap id="singleStopMap" interactiveLayerIds={['stop']} scrollZoom={false}>
				<Source data={mapData} id="stop" type="geojson">
					<Layer id="stop" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 6, 'circle-stroke-color': '#000000', 'circle-stroke-width': 2 }} source="stop" type="circle" />
				</Source>
			</OSMMap>
		</div>
	);

	//
}
