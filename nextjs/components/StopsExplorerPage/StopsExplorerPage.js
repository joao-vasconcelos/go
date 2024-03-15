'use client';

/* * */

import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import OSMMap from '@/components/OSMMap/OSMMap';
import Pannel from '@/components/Pannel/Pannel';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import StopsExplorerPageHeader from '@/components/StopsExplorerPageHeader/StopsExplorerPageHeader';

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
      type: 'FeatureCollection',
      features: [],
    };

    // Loop through each stop in the collection and setup the feature to the GeoJSON object.
    if (stopsExplorerContext.list.items) {
      for (const stop of stopsExplorerContext.list.items) {
        geoJSON.features.push({
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
      <OSMMap id="allStopsMap" mapStyle={stopsExplorerContext.map.style} onClick={handleMapClick} interactiveLayerIds={['all-stops']}>
        <Source id="all-stops" type="geojson" data={mapData}>
          <Layer id="all-stops" type="circle" source="all-stops" paint={{ 'circle-color': '#ffdd01', 'circle-radius': 6, 'circle-stroke-width': 2, 'circle-stroke-color': '#000000' }} />
        </Source>
      </OSMMap>
    </Pannel>
  );

  //
}
