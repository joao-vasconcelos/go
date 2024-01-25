'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { SegmentedControl, Switch } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import OSMMap from '../OSMMap/OSMMap';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';

/* * */

export default function RealtimeExplorerResultTripDetailMap() {
  //

  //
  // A. Setup variables

  const { realtimeExplorerResultTripDetailMap } = useMap();
  const realtimeExplorerContext = useRealtimeExplorerContext();
  //   const t = useTranslations('RealtimeExplorerResultTripDetailMap');

  const [showAllZonesOnMap, setShowAllZonesOnMap] = useState(false);
  const [showAllStopsOnMap, setShowAllStopsOnMap] = useState(false);
  const [allowScrollOnMap, setAllowScrollOnMap] = useState(false);
  const [mapStyle, setMapStyle] = useState('map');

  //
  // B. Fetch data

  const { data: patternData } = useSWR(realtimeExplorerContext.selectedTrip.pattern_id && `https://api.carrismetropolitana.pt/patterns/${realtimeExplorerContext.selectedTrip.pattern_id}`);
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
      type: 'FeatureCollection',
      features: [],
    };
    if (realtimeExplorerContext.selectedTrip.raw_events?.length > 1) {
      for (const [index, rawEventData] of realtimeExplorerContext.selectedTrip.raw_events.entries()) {
        geoJSON.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [rawEventData.content?.entity[0]?.vehicle?.position?.longitude, rawEventData.content?.entity[0]?.vehicle?.position?.latitude],
          },
          properties: {
            index: index + 1,
            _id: rawEventData.content?.entity[0]?._id,
            // code: pathSequence.stop?.code,
            // name: pathSequence.stop?.name,
            latitude: rawEventData.content?.entity[0]?.vehicle?.position?.latitude,
            longitude: rawEventData.content?.entity[0]?.vehicle?.position?.longitude,
          },
        });
      }
    }
    return geoJSON;
  }, [realtimeExplorerContext.selectedTrip.raw_events]);

  const allTripEventsAsShapeMapData = useMemo(() => {
    // Create a GeoJSON object
    const geoJSON = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
    };
    if (realtimeExplorerContext.selectedTrip.raw_events?.length > 1) {
      for (const [index, rawEventData] of realtimeExplorerContext.selectedTrip.raw_events.entries()) {
        geoJSON.geometry.coordinates.push([rawEventData.content?.entity[0]?.vehicle?.position?.longitude, rawEventData.content?.entity[0]?.vehicle?.position?.latitude]);
      }
    }
    return geoJSON;
  }, [realtimeExplorerContext.selectedTrip.raw_events]);

  //
  // D. Render components

  return (
    <div style={{ height: 600 }}>
      <OSMMap
        id="realtimeExplorerResultTripDetailMap"
        height={600}
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
        {shapeData?.geojson && (
          <Source id="pattern-shape" type="geojson" data={shapeData.geojson}>
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
                'line-color': patternData?.color || '#000000',
                'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 12],
              }}
            />
          </Source>
        )}
        {allTripEventsAsShapeMapData && (
          <Source id="pattern-shape" type="geojson" data={allTripEventsAsShapeMapData}>
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
                // 'line-color': typologyData ? typologyData.color : '#000000',
                'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 12],
              }}
            />
          </Source>
        )}
        {allTripEventsAsPointsMapData && (
          <Source id="trip-raw-events" type="geojson" data={allTripEventsAsPointsMapData}>
            <Layer id="trip-raw-event-circle" type="circle" source="trip-raw-events" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 8, 'circle-stroke-width': 1, 'circle-stroke-color': '#000000' }} />
            <Layer id="trip-raw-event-label" type="symbol" source="trip-raw-events" layout={{ 'text-field': ['get', 'index'], 'text-offset': [0, 0], 'text-anchor': 'center', 'text-size': 10 }} />
          </Source>
        )}
      </OSMMap>
    </div>
  );

  //
}
