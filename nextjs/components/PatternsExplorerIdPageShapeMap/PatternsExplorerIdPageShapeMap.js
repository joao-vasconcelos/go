'use client';

/* * */

import OSMMap from '@/components/OSMMap/OSMMap';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import { SegmentedControl, Switch } from '@mantine/core';
import bbox from '@turf/bbox';
import { useEffect, useMemo, useState } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';
import useSWR from 'swr';

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
				{ duration: 2000, padding: 50 },
			);
		}
		//
	}, [patternsExplorerContext.form.values, patternShapeMap]);

	const patternStopsMapData = useMemo(() => {
		// Create a GeoJSON object
		const geoJSON = {
			features: [],
			type: 'FeatureCollection',
		};
		if (patternStopsData?.path?.length > 1) {
			for (const [pathSequenceIndex, pathSequence] of patternStopsData.path.entries()) {
				geoJSON.features.push({
					geometry: {
						coordinates: [pathSequence.stop?.longitude, pathSequence.stop?.latitude],
						type: 'Point',
					},
					properties: {
						_id: pathSequence.stop?._id,
						code: pathSequence.stop?.code,
						index: pathSequenceIndex + 1,
						latitude: pathSequence.stop?.latitude,
						longitude: pathSequence.stop?.longitude,
						name: pathSequence.stop?.name,
					},
					type: 'Feature',
				});
			}
		}
		return geoJSON;
	}, [patternStopsData]);

	const allZonesMapData = useMemo(() => {
		// Create a GeoJSON object
		const geoJSON = {
			features: [],
			type: 'FeatureCollection',
		};
		if (allZonesData) {
			for (const zone of allZonesData) {
				if (zone?.geojson.geometry.coordinates?.length > 0) {
					geoJSON.features.push({
						...zone.geojson,
						properties: {
							border_color: zone.border_color,
							border_opacity: zone.border_opacity,
							border_width: zone.border_width,
							code: zone.code,
							fill_color: zone.fill_color,
							fill_opacity: zone.fill_opacity,
							name: zone.name,
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
			features: [],
			type: 'FeatureCollection',
		};
		if (allStopsData) {
			for (const stop of allStopsData) {
				geoJSON.features.push({
					geometry: {
						coordinates: [parseFloat(stop?.longitude), parseFloat(stop?.latitude)],
						type: 'Point',
					},
					properties: {
						_id: stop?._id,
						code: stop?.code,
						latitude: stop?.latitude,
						longitude: stop?.longitude,
						name: stop?.name,
					},
					type: 'Feature',
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
				height={500}
				id="patternShapeMap"
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
				{allZonesMapData && showAllZonesOnMap
				&& (
					<Source data={allZonesMapData} id="all-zones" type="geojson">
						<Layer id="all-zones-polygons" layout={{}} paint={{ 'fill-color': ['get', 'fill_color'], 'fill-opacity': ['get', 'fill_opacity'] }} source="all-zones" type="fill" />
						<Layer id="all-zones-borders" layout={{}} paint={{ 'line-color': ['get', 'border_color'], 'line-opacity': ['get', 'border_opacity'], 'line-width': ['get', 'border_width'] }} source="all-zones" type="line" />
						<Layer id="all-zones-labels" layout={{ 'text-anchor': 'center', 'text-field': ['get', 'name'], 'text-offset': [0, 0], 'text-size': 14 }} source="all-zones" type="symbol" />
					</Source>
				)}
				{allStopsMapData && showAllStopsOnMap
				&& (
					<Source data={allStopsMapData} id="all-stops" type="geojson">
						<Layer id="all-stops" paint={{ 'circle-color': 'rgba(255,220,0,0.75)', 'circle-radius': 2, 'circle-stroke-color': 'rgba(0,0,0,0.5)', 'circle-stroke-width': 1 }} source="all-stops" type="circle" />
					</Source>
				)}
				{patternsExplorerContext.form.values?.shape?.geojson
				&& (
					<Source data={patternsExplorerContext.form.values.shape.geojson} id="pattern-shape" type="geojson">
						<Layer
							id="pattern-shape-direction"
							source="pattern-shape"
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
							beforeId="pattern-shape-direction"
							id="pattern-shape-line"
							source="pattern-shape"
							type="line"
							layout={{
								'line-cap': 'round',
								'line-join': 'round',
							}}
							paint={{
								'line-color': typologyData ? typologyData.color : '#000000',
								'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 12],
							}}
						/>
					</Source>
				)}
				{patternStopsMapData
				&& (
					<Source data={patternStopsMapData} id="pattern-stops" type="geojson">
						<Layer id="pattern-stops-circle" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 8, 'circle-stroke-color': '#000000', 'circle-stroke-width': 1 }} source="pattern-stops" type="circle" />
						<Layer id="pattern-stops-labels" layout={{ 'text-anchor': 'center', 'text-field': ['get', 'index'], 'text-offset': [0, 0], 'text-size': 10 }} source="pattern-stops" type="symbol" />
					</Source>
				)}
			</OSMMap>
		</div>
	);

	//
}
