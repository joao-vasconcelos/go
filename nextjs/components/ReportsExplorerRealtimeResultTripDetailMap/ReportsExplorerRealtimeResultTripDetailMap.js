'use client';

/* * */

import OSMMap from '@/components/OSMMap/OSMMap';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { SegmentedControl, Switch } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';
import useSWR from 'swr';

/* * */

export default function ReportsExplorerRealtimeResultTripDetailMap() {
	//

	//
	// A. Setup variables

	const { realtimeExplorerResultTripDetailMap } = useMap();
	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

	const [showAllZonesOnMap, setShowAllZonesOnMap] = useState(false);
	const [showAllStopsOnMap, setShowAllStopsOnMap] = useState(false);
	const [allowScrollOnMap, setAllowScrollOnMap] = useState(true);
	const [mapStyle, setMapStyle] = useState('map');

	//
	// B. Fetch data

	const { data: patternData } = useSWR(reportsExplorerRealtimeContext.selectedTrip.pattern_id && `https://api.carrismetropolitana.pt/patterns/${reportsExplorerRealtimeContext.selectedTrip.pattern_id}`);
	const { data: shapeData } = useSWR(patternData?.shape_id && `https://api.carrismetropolitana.pt/shapes/${patternData.shape_id}`);

	//
	// C. Transform data

	useEffect(() => {
		if (!realtimeExplorerResultTripDetailMap) return;
		// Load direction arrows
		realtimeExplorerResultTripDetailMap.loadImage('/icons/shape-arrow-direction.png', (error, image) => {
			if (error) throw error;
			realtimeExplorerResultTripDetailMap.addImage('shape-arrow-direction', image, { sdf: true });
		});
	}, [realtimeExplorerResultTripDetailMap]);

	const allTripEventsAsPointsMapData = useMemo(() => {
		// Create a GeoJSON object
		const geoJSON = {
			features: [],
			type: 'FeatureCollection',
		};
		if (reportsExplorerRealtimeContext.selectedTrip.positions?.length > 1) {
			const sortedPositions = reportsExplorerRealtimeContext.selectedTrip.positions.sort((a, b) => Number(a[reportsExplorerRealtimeContext.form.event_order_type]) - Number(b[reportsExplorerRealtimeContext.form.event_order_type]));
			const clippedPositions = sortedPositions.slice(0, reportsExplorerRealtimeContext.selectedTrip.event_animation_index);
			for (const [index, positionData] of clippedPositions.entries()) {
				geoJSON.features.push({
					geometry: {
						coordinates: [positionData.lon, positionData.lat],
						type: 'Point',
					},
					properties: {
						index: index + 1,
						// _id: rawEventData.content?.entity[0]?._id,
						// code: pathSequence.stop?.code,
						// name: pathSequence.stop?.name,
						latitude: positionData.lat,
						longitude: positionData.lon,
					},
					type: 'Feature',
				});
			}
		}
		return geoJSON;
	}, [reportsExplorerRealtimeContext.selectedTrip.event_animation_index, reportsExplorerRealtimeContext.form.event_order_type, reportsExplorerRealtimeContext.selectedTrip.positions]);

	const allTripEventsAsShapeMapData = useMemo(() => {
		// Create a GeoJSON object
		const geoJSON = {
			geometry: {
				coordinates: [],
				type: 'LineString',
			},
			properties: {},
			type: 'Feature',
		};
		if (reportsExplorerRealtimeContext.selectedTrip.positions?.length > 1) {
			const sortedPositions = reportsExplorerRealtimeContext.selectedTrip.positions.sort((a, b) => Number(a[reportsExplorerRealtimeContext.form.event_order_type]) - Number(b[reportsExplorerRealtimeContext.form.event_order_type]));
			const clippedPositions = sortedPositions.slice(0, reportsExplorerRealtimeContext.selectedTrip.event_animation_index);
			for (const [index, positionData] of clippedPositions.entries()) {
				geoJSON.geometry.coordinates.push([positionData.lon, positionData.lat]);
			}
		}
		return geoJSON;
	}, [reportsExplorerRealtimeContext.selectedTrip.event_animation_index, reportsExplorerRealtimeContext.form.event_order_type, reportsExplorerRealtimeContext.selectedTrip.positions]);

	//
	// D. Render components

	return (
		<div style={{ height: 500, minHeight: 500 }}>
			<OSMMap
				height={500}
				id="realtimeExplorerResultTripDetailMap"
				mapStyle={mapStyle}
				scrollZoom={allowScrollOnMap}
				toolbar={(
					<>
						<SegmentedControl
							onChange={setMapStyle}
							size="xs"
							value={mapStyle}
							data={[
								{ label: 'Map', value: 'map' },
								{ label: 'Satellite', value: 'satellite' },
							]}
						/>
						<Switch defaultChecked={showAllZonesOnMap} label="Show Zones" onChange={event => setShowAllZonesOnMap(event.currentTarget.checked)} size="xs" value={showAllZonesOnMap} />
						<Switch defaultChecked={showAllStopsOnMap} label="Show All Stops" onChange={event => setShowAllStopsOnMap(event.currentTarget.checked)} size="xs" value={showAllStopsOnMap} />
						<Switch defaultChecked={allowScrollOnMap} label="Allow Scroll" onChange={event => setAllowScrollOnMap(event.currentTarget.checked)} size="xs" value={allowScrollOnMap} />
					</>
				)}
			>
				{/* {allZonesMapData && showAllZonesOnMap && (
          <Source id="all-zones" type="geojson" data={allZonesMapData}>
            <Layer id="all-zones-polygons" type="fill" source="all-zones" layout={{}} paint={{ 'fill-color': ['get', 'fill_color'], 'fill-opacity': ['get', 'fill_opacity'] }} />
            <Layer id="all-zones-borders" type="line" layout={{}} source="all-zones" paint={{ 'line-color': ['get', 'border_color'], 'line-opacity': ['get', 'border_opacity'], 'line-width': ['get', 'border_width'] }} />
            <Layer id="all-zones-labels" type="symbol" source="all-zones" layout={{ 'text-field': ['get', 'name'], 'text-offset': [0, 0], 'text-anchor': 'center', 'text-size': 14 }} />
          </Source>
        )} */}
				{/* {allStopsMapData && showAllStopsOnMap && (
          <Source id="all-stops" type="geojson" data={allStopsMapData}>
            <Layer id="all-stops" type="circle" source="all-stops" paint={{ 'circle-color': 'rgba(255,220,0,0.75)', 'circle-radius': 2, 'circle-stroke-width': 1, 'circle-stroke-color': 'rgba(0,0,0,0.5)' }} />
          </Source>
        )} */}
				{shapeData?.geojson
				&& (
					<Source data={shapeData.geojson} id="planned-shape" type="geojson">
						<Layer
							id="planned-shape-direction"
							source="planned-shape"
							type="symbol"
							layout={{
								'icon-allow-overlap': true,
								'icon-anchor': 'center',
								'icon-ignore-placement': true,
								'icon-image': 'shape-arrow-direction',
								'icon-offset': [0, 0],
								'icon-rotate': 90,
								'icon-size': ['interpolate', ['linear', 0.5], ['zoom'], 10, 0.1, 20, 0.2],
								'symbol-placement': 'line',
								'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 10, 2, 20, 30],
							}}
							paint={{
								'icon-color': '#ffffff',
								'icon-opacity': 0.8,
							}}
						/>
						<Layer
							beforeId="planned-shape-direction"
							id="planned-shape-line"
							source="planned-shape"
							type="line"
							layout={{
								'line-cap': 'round',
								'line-join': 'round',
							}}
							paint={{
								'line-color': patternData?.color || '#000000',
								'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 12],
							}}
						/>
					</Source>
				)}
				{allTripEventsAsShapeMapData
				&& (
					<Source data={allTripEventsAsShapeMapData} id="trip-events" type="geojson">
						<Layer
							id="trip-events-direction"
							source="trip-events"
							type="symbol"
							layout={{
								'icon-allow-overlap': true,
								'icon-anchor': 'center',
								'icon-ignore-placement': true,
								'icon-image': 'shape-arrow-direction',
								'icon-offset': [0, 0],
								'icon-rotate': 90,
								'icon-size': ['interpolate', ['linear', 0.5], ['zoom'], 10, 0.1, 20, 0.2],
								'symbol-placement': 'line',
								'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 10, 2, 20, 30],
							}}
							paint={{
								'icon-color': '#ffffff',
								'icon-opacity': 0.8,
							}}
						/>
						<Layer
							beforeId="trip-events-direction"
							id="trip-events-line"
							source="trip-events"
							type="line"
							layout={{
								'line-cap': 'round',
								'line-join': 'round',
							}}
							paint={{
								// 'line-color': typologyData ? typologyData.color : '#000000',
								'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 12],
							}}
						/>
					</Source>
				)}
				{allTripEventsAsPointsMapData
				&& (
					<Source data={allTripEventsAsPointsMapData} id="trip-raw-events" type="geojson">
						<Layer id="trip-raw-event-circle" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 8, 'circle-stroke-color': '#000000', 'circle-stroke-width': 1 }} source="trip-raw-events" type="circle" />
						<Layer id="trip-raw-event-label" layout={{ 'text-anchor': 'center', 'text-field': ['get', 'index'], 'text-offset': [0, 0], 'text-size': 10 }} source="trip-raw-events" type="symbol" />
					</Source>
				)}
			</OSMMap>
		</div>
	);

	//
}
