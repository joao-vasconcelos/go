import styles from './OSMMap.module.css';
import osmMapDefaults from './OSMMap.config';
import Map, { NavigationControl, FullscreenControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Divider } from '@mantine/core';

export default function OSMMap({ id, mapStyle, width, height, scrollZoom = true, onClick = () => {}, interactiveLayerIds = [], children, toolbar }) {
  return (
    <div className={styles.container} style={{ width: width || '100%', height: height || '100%' }}>
      <Map
        id={`${id}Map`}
        mapLib={maplibregl}
        initialViewState={osmMapDefaults.initialViewState}
        minZoom={osmMapDefaults.minZoom}
        maxZoom={osmMapDefaults.maxZoom}
        scrollZoom={scrollZoom}
        mapStyle={osmMapDefaults.styles[mapStyle] || osmMapDefaults.styles.default}
        style={{ width: width || '100%', height: height || '100%' }}
        onClick={onClick}
        interactive={interactiveLayerIds ? true : false}
        interactiveLayerIds={interactiveLayerIds}
      >
        <NavigationControl />
        <FullscreenControl />
        {children}
      </Map>
      <Divider />
      {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
    </div>
  );
}
