'use client';

/* * */

import OSMMap from '@/components/OSMMap/OSMMap';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { useEffect, useMemo, useState } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';
import useSWR from 'swr';

import styles from './StopsExplorerNewStopWizardSteps0Map.module.css';

/* * */

export default function StopsExplorerNewStopWizardSteps0Map() {
	//

	//
	// A. Setup variables

	const { stopsExplorerNewStopWizardSteps0Map } = useMap();
	const [mapStyle, setMapStyle] = useState('map');
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// B. Fetch data

	const { data: allStopsData } = useSWR('/api/stops');

	//
	// C. Setup map

	useEffect(() => {
		if (!stopsExplorerNewStopWizardSteps0Map) return;
		// Load pin symbol
		stopsExplorerNewStopWizardSteps0Map.loadImage('/icons/map-pin.png', (error, image) => {
			if (error) throw error;
			stopsExplorerNewStopWizardSteps0Map.addImage('map-pin', image, { sdf: false });
		});
	}, [stopsExplorerNewStopWizardSteps0Map]);

	//
	// D. Transform data

	const allStopsMapData = useMemo(() => {
		if (allStopsData) {
			return {
				features: allStopsData.map(stop => ({
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
				})),
				type: 'FeatureCollection',
			};
		}
		return null;
	}, [allStopsData]);

	const selectedCoordinatesMapData = useMemo(() => {
		if (stopsExplorerNewStopWizardContext.newStop.latitude && stopsExplorerNewStopWizardContext.newStop.longitude) {
			return {
				geometry: {
					coordinates: [stopsExplorerNewStopWizardContext.newStop.longitude, stopsExplorerNewStopWizardContext.newStop.latitude],
					type: 'Point',
				},
				type: 'Feature',
			};
		}
		return null;
	}, [stopsExplorerNewStopWizardContext.newStop.latitude, stopsExplorerNewStopWizardContext.newStop.longitude]);

	//
	// E. Handle actions

	const handleMapClick = (event) => {
		stopsExplorerNewStopWizardContext.setNewStopCoordinates(event.lngLat.lat, event.lngLat.lng);
	};

	const handleMapDragStart = () => {
		stopsExplorerNewStopWizardSteps0Map.getCanvas().style.cursor = 'grabbing';
	};

	const handleMapDragEnd = () => {
		stopsExplorerNewStopWizardSteps0Map.getCanvas().style.cursor = 'crosshair';
	};

	//
	// F. Render components

	return (
		<div className={styles.container}>
			<OSMMap id="stopsExplorerNewStopWizardSteps0Map" interactiveLayerIds={['all-stops']} mapStyle={mapStyle} onClick={handleMapClick} onDragEnd={handleMapDragEnd} onDragStart={handleMapDragStart} onMouseMove={handleMapDragEnd}>
				{allStopsMapData != null
				&& (
					<Source data={allStopsMapData} id="all-stops" type="geojson">
						<Layer id="all-stops" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 6, 'circle-stroke-color': '#000000', 'circle-stroke-width': 2 }} source="all-stops" type="circle" />
					</Source>
				)}
				{selectedCoordinatesMapData != null
				&& (
					<Source data={selectedCoordinatesMapData} generateId={true} id="selected-coordinates" type="geojson">
						<Layer
							id="selected-coordinates-pin"
							source="selected-coordinates"
							type="symbol"
							layout={{
								'icon-allow-overlap': true,
								'icon-anchor': 'bottom',
								'icon-ignore-placement': true,
								'icon-image': 'map-pin',
								'icon-offset': [0, 5],
								'icon-size': ['interpolate', ['linear', 0.5], ['zoom'], 10, 0.25, 20, 0.35],
								'symbol-placement': 'point',
							}}
							paint={{
								'icon-opacity': ['interpolate', ['linear', 0.5], ['zoom'], 7, 0, 10, 1],
							}}
						/>
					</Source>
				)}
			</OSMMap>
		</div>
	);

	//
}
