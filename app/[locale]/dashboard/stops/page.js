'use client';

import useSWR from 'swr';
import { useState, useMemo } from 'react';
import { useMap, Source, Layer } from 'react-map-gl';
import { IconArrowsMinimize, IconBrandGoogleMaps } from '@tabler/icons-react';
import { Tooltip, ActionIcon, SegmentedControl } from '@mantine/core';
import OSMMap from '../../../../components/OSMMap/OSMMap';
import OSMMapDefaults from '../../../../components/OSMMap/OSMMap.config';
import Pannel from '../../../../components/Pannel/Pannel';
import Text from '../../../../components/Text/Text';
import { useTranslations } from 'next-intl';

export default function Page() {
  //

  //
  // A. Setup variables

  const { allStopsMap } = useMap();
  const [mapStyle, setMapStyle] = useState('map');
  const t = useTranslations('stops');

  //
  // B. Fetch data

  const { data: stopsData, error: stopsError, isLoading: stopsLoading, isValidating: stopsValidating } = useSWR('/api/stops');

  //
  // D. Handle actions

  const handleMapReCenter = () => {
    allStopsMap.flyTo({ ...OSMMapDefaults.viewport, duration: 2000 });
  };

  const handleOpenInGoogleMaps = () => {
    const center = allStopsMap.getCenter();
    const zoom = allStopsMap.getZoom();
    window.open(`https://www.google.com/maps/@${center.lat},${center.lng},${zoom}z`, '_blank', 'noopener,noreferrer');
  };

  const handleMapClick = (event) => {
    console.log(event.features[0]);
  };

  //
  // D. Transform data

  const mapData = useMemo(() => {
    // Create a GeoJSON object
    const geoJSON = {
      type: 'FeatureCollection',
      features: [],
    };

    // Loop through each stop in the collection and setup the feature to the GeoJSON object.
    if (stopsData) {
      for (const stop of stopsData) {
        geoJSON.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(stop.stop_lon), parseFloat(stop.stop_lat)],
          },
          properties: {
            _id: stop._id,
            stop_code: stop.stop_code,
            stop_name: stop.stop_name,
            stop_lat: stop.stop_lat,
            stop_lon: stop.stop_lon,
          },
        });
      }
    }
    // Return parsed data
    return geoJSON;
    // Only run if stopsData changes
  }, [stopsData]);

  //
  // E. Render components

  return (
    <Pannel
      header={
        <>
          <Tooltip label={t('operations.recenter.title')} position='bottom' withArrow>
            <ActionIcon color='gray' variant='light' size='lg' onClick={handleMapReCenter}>
              <IconArrowsMinimize size='20px' />
            </ActionIcon>
          </Tooltip>
          <Text size='h1' full>
            {t('page.title')}
          </Text>
          <Tooltip label={t('operations.gmaps.title')} position='bottom' withArrow>
            <ActionIcon color='gray' variant='light' size='lg' onClick={handleOpenInGoogleMaps}>
              <IconBrandGoogleMaps size='20px' />
            </ActionIcon>
          </Tooltip>
          <div>
            <SegmentedControl
              value={mapStyle}
              onChange={setMapStyle}
              data={[
                { label: 'Map', value: 'map' },
                { label: 'Satellite', value: 'satellite' },
              ]}
            />
          </div>
        </>
      }
    >
      <OSMMap id='allStops' mapStyle={mapStyle} onClick={handleMapClick} interactiveLayerIds={['all-stops']}>
        <Source id='all-stops' type='geojson' data={mapData}>
          <Layer id='all-stops' type='circle' source='all-stops' paint={{ 'circle-color': '#ffdd01', 'circle-radius': 6, 'circle-stroke-width': 2, 'circle-stroke-color': '#000000' }} />
        </Source>
      </OSMMap>
    </Pannel>
  );
}
