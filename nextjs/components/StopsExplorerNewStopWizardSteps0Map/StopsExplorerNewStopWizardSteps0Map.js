'use client';

/* * */

import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';
import OSMMap from '@/components/OSMMap/OSMMap';
import { useMap, Source, Layer } from 'react-map-gl/maplibre';
import styles from './StopsExplorerNewStopWizardSteps0Map.module.css';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';

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
        type: 'FeatureCollection',
        features: allStopsData.map((stop) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(stop.longitude), parseFloat(stop.latitude)],
          },
          properties: {
            _id: stop._id,
            code: stop.code,
            name: stop.name,
            latitude: stop.latitude,
            longitude: stop.longitude,
          },
        })),
      };
    }
    return null;
  }, [allStopsData]);

  const selectedCoordinatesMapData = useMemo(() => {
    if (stopsExplorerNewStopWizardContext.newStop.latitude && stopsExplorerNewStopWizardContext.newStop.longitude) {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [stopsExplorerNewStopWizardContext.newStop.longitude, stopsExplorerNewStopWizardContext.newStop.latitude],
        },
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
      <OSMMap id="stopsExplorerNewStopWizardSteps0Map" mapStyle={mapStyle} onClick={handleMapClick} onMouseMove={handleMapDragEnd} onDragStart={handleMapDragStart} onDragEnd={handleMapDragEnd} interactiveLayerIds={['all-stops']}>
        {allStopsMapData != null && (
          <Source id="all-stops" type="geojson" data={allStopsMapData}>
            <Layer id="all-stops" type="circle" source="all-stops" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 6, 'circle-stroke-width': 2, 'circle-stroke-color': '#000000' }} />
          </Source>
        )}
        {selectedCoordinatesMapData != null && (
          <Source id="selected-coordinates" type="geojson" data={selectedCoordinatesMapData} generateId={true}>
            <Layer
              id="selected-coordinates-pin"
              type="symbol"
              source="selected-coordinates"
              layout={{
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
                'icon-anchor': 'bottom',
                'symbol-placement': 'point',
                'icon-image': 'map-pin',
                'icon-size': ['interpolate', ['linear', 0.5], ['zoom'], 10, 0.25, 20, 0.35],
                'icon-offset': [0, 5],
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
