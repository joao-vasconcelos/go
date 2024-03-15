'use client';

/* * */

import { useMemo } from 'react';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { Source, Layer, useMap } from 'react-map-gl/maplibre';
import OSMMap from '@/components/OSMMap/OSMMap';

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
      type: 'Feature',
      geometry: {},
      properties: {},
    };

    // Loop through each stop in the collection and setup the feature to the GeoJSON object.
    if (stopsExplorerContext.form.values && stopsExplorerContext.form.values.latitude && stopsExplorerContext.form.values.longitude) {
      geoJSON.geometry = {
        type: 'Point',
        coordinates: [parseFloat(stopsExplorerContext.form.values.longitude), parseFloat(stopsExplorerContext.form.values.latitude)],
      };
      geoJSON.properties = {
        _id: stopsExplorerContext.form.values._id,
        code: stopsExplorerContext.form.values.code,
        name: stopsExplorerContext.form.values.name,
        latitude: stopsExplorerContext.form.values.latitude,
        longitude: stopsExplorerContext.form.values.longitude,
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
      <OSMMap id="singleStop" scrollZoom={false} interactiveLayerIds={['stop']}>
        <Source id="stop" type="geojson" data={mapData}>
          <Layer id="stop" type="circle" source="stop" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 6, 'circle-stroke-width': 2, 'circle-stroke-color': '#000000' }} />
        </Source>
      </OSMMap>
    </div>
  );

  //
}
