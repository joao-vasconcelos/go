'use client';

/* * */

import useSWR from 'swr';
import bbox from '@turf/bbox';
import { useState, useEffect, useMemo } from 'react';
import { Switch, SegmentedControl } from '@mantine/core';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import OSMMap from '@/components/OSMMap/OSMMap';
import { useMap, Source, Layer } from 'react-map-gl/maplibre';
import styles from './PatternsExplorerIdPageShapeMap.module.css';

/* * */

export default function PatternsExplorerIdPageShapeMap() {
	//

	//
	// A. Setup variables

	const linessExplorerContext = useLinesExplorerContext();
	const patternsExplorerContext = usePatternsExplorerContext();

	const { patternShapeMap } = useMap();

	const [showAllZonesOnMap, setShowAllZonesOnMap] = useState(false);
	const [showAllStopsOnMap, setShowAllStopsOnMap] = useState(false);
	const [allowScrollOnMap, setAllowScrollOnMap] = useState(false);
	const [mapStyle, setMapStyle] = useState('map');

	//
	// B. Fetch data

	const { data: allZonesData } = useSWR('/api/zones');
	const { data: allStopsData } = useSWR('/api/stops');
	const { data: typologyData } = useSWR(linessExplorerContext.item_data && linessExplorerContext.item_data.typology && `/api/typologies/${linessExplorerContext.item_data.typology}`);
	const { data: patternStopsData } = useSWR(patternsExplorerContext.item_id && `/api/patterns/${patternsExplorerContext.item_id}/stops`);
	//
	// C. Transform data

	useEffect(() => {
		if (!patternShapeMap) return;
		// Load direction arrows
		patternShapeMap.loadImage('/icons/shape-arrow-direction.png', (error, image) => {
			if (error) throw error;
			patternShapeMap.addImage('shape-arrow-direction', image, { sdf: true });
		});
	}, [patternShapeMap]);

	useEffect(() => {
		if (patternsExplorerContext.form.values?.shape?.geojson?.geometry?.coordinates?.length) {
			// Calculate the bounding box of the feature
			const [minLng, minLat, maxLng, maxLat] = bbox(patternsExplorerContext.form.values.shape.geojson);
			patternShapeMap?.fitBounds(
				[
					[minLng, minLat],
					[maxLng, maxLat],
				],
				{ padding: 50, duration: 2000 },
			);
		}
		//
	}, [patternsExplorerContext.form.values, patternShapeMap]);

	const patternStopsMapData = useMemo(() => {
		// Create a GeoJSON object
		const geoJSON = {
			type: 'FeatureCollection',
			features: [],
		};
		if (patternStopsData?.path?.length > 1) {
			for (const [pathSequenceIndex, pathSequence] of patternStopsData.path.entries()) {
				geoJSON.features.push({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [pathSequence.stop?.longitude, pathSequence.stop?.latitude],
					},
					properties: {
						index: pathSequenceIndex + 1,
						_id: pathSequence.stop?._id,
						code: pathSequence.stop?.code,
						name: pathSequence.stop?.name,
						latitude: pathSequence.stop?.latitude,
						longitude: pathSequence.stop?.longitude,
					},
				});
			}
		}
		return geoJSON;
	}, [patternStopsData]);

	const allZonesMapData = useMemo(() => {
		// Create a GeoJSON object
		const geoJSON = {
			type: 'FeatureCollection',
			features: [],
		};
		if (allZonesData) {
			for (const zone of allZonesData) {
				if (zone?.geojson.geometry.coordinates?.length > 0) {
					geoJSON.features.push({
						...zone.geojson,
						properties: {
							name: zone.name,
							code: zone.code,
							fill_color: zone.fill_color,
							fill_opacity: zone.fill_opacity,
							border_color: zone.border_color,
							border_opacity: zone.border_opacity,
							border_width: zone.border_width,
						},
					});
				}
			}
		}
		return geoJSON;
	}, [allZonesData]);

	const allStopsMapData = useMemo(() => {
		// Create a GeoJSON object
		const geoJSON = {
			type: 'FeatureCollection',
			features: [],
		};
		if (allStopsData) {
			for (const stop of allStopsData) {
				geoJSON.features.push({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [parseFloat(stop?.longitude), parseFloat(stop?.latitude)],
					},
					properties: {
						_id: stop?._id,
						code: stop?.code,
						name: stop?.name,
						latitude: stop?.latitude,
						longitude: stop?.longitude,
					},
				});
			}
		}
		return geoJSON;
	}, [allStopsData]);

	//
	// D. Render components

	return (
		<div className={styles.mapWrapper}>
			<OSMMap
				id="patternShapeMap"
				height={500}
				scrollZoom={allowScrollOnMap}
				mapStyle={mapStyle}
				toolbar={
					<>
						<SegmentedControl
							value={mapStyle}
							onChange={setMapStyle}
							size="xs"
							data={[
								{ label: 'Map', value: 'map' },
								{ label: 'Satellite', value: 'satellite' },
							]}
						/>
						<Switch size="xs" label={'Show Zones'} defaultChecked={showAllZonesOnMap} value={showAllZonesOnMap} onChange={(event) => setShowAllZonesOnMap(event.currentTarget.checked)} />
						<Switch size="xs" label={'Show All Stops'} defaultChecked={showAllStopsOnMap} value={showAllStopsOnMap} onChange={(event) => setShowAllStopsOnMap(event.currentTarget.checked)} />
						<Switch size="xs" label={'Allow Scroll'} defaultChecked={allowScrollOnMap} value={allowScrollOnMap} onChange={(event) => setAllowScrollOnMap(event.currentTarget.checked)} />
					</>
				}
			>
				{allZonesMapData && showAllZonesOnMap &&
          <Source id="all-zones" type="geojson" data={allZonesMapData}>
          	<Layer id="all-zones-polygons" type="fill" source="all-zones" layout={{}} paint={{ 'fill-color': ['get', 'fill_color'], 'fill-opacity': ['get', 'fill_opacity'] }} />
          	<Layer id="all-zones-borders" type="line" layout={{}} source="all-zones" paint={{ 'line-color': ['get', 'border_color'], 'line-opacity': ['get', 'border_opacity'], 'line-width': ['get', 'border_width'] }} />
          	<Layer id="all-zones-labels" type="symbol" source="all-zones" layout={{ 'text-field': ['get', 'name'], 'text-offset': [0, 0], 'text-anchor': 'center', 'text-size': 14 }} />
          </Source>
				}
				{allStopsMapData && showAllStopsOnMap &&
          <Source id="all-stops" type="geojson" data={allStopsMapData}>
          	<Layer id="all-stops" type="circle" source="all-stops" paint={{ 'circle-color': 'rgba(255,220,0,0.75)', 'circle-radius': 2, 'circle-stroke-width': 1, 'circle-stroke-color': 'rgba(0,0,0,0.5)' }} />
          </Source>
				}
				{patternsExplorerContext.form.values?.shape?.geojson &&
          <Source id="pattern-shape" type="geojson" data={patternsExplorerContext.form.values.shape.geojson}>
          	<Layer
          		id="pattern-shape-direction"
          		type="symbol"
          		source="pattern-shape"
          		layout={{
          			'icon-allow-overlap': true,
          			'icon-ignore-placement': true,
          			'icon-anchor': 'center',
          			'symbol-placement': 'line',
          			'icon-image': 'shape-arrow-direction',
          			'icon-size': ['interpolate', ['linear', 0.5], ['zoom'], 10, 0.1, 20, 0.2],
          			'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 10, 2, 20, 30],
          			'icon-offset': [0, 0],
          			'icon-rotate': 90,
          		}}
          		paint={{
          			'icon-color': '#ffffff',
          			'icon-opacity': 0.8,
          		}}
          	/>
          	<Layer
          		id="pattern-shape-line"
          		type="line"
          		source="pattern-shape"
          		beforeId="pattern-shape-direction"
          		layout={{
          			'line-join': 'round',
          			'line-cap': 'round',
          		}}
          		paint={{
          			'line-color': typologyData ? typologyData.color : '#000000',
          			'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 12],
          		}}
          	/>
          </Source>
				}
				{patternStopsMapData &&
          <Source id="pattern-stops" type="geojson" data={patternStopsMapData}>
          	<Layer id="pattern-stops-circle" type="circle" source="pattern-stops" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 8, 'circle-stroke-width': 1, 'circle-stroke-color': '#000000' }} />
          	<Layer id="pattern-stops-labels" type="symbol" source="pattern-stops" layout={{ 'text-field': ['get', 'index'], 'text-offset': [0, 0], 'text-anchor': 'center', 'text-size': 10 }} />
          </Source>
				}
			</OSMMap>
		</div>
	);

	//
}