/* * */

import styles from './OSMMap.module.css';
import osmMapDefaults from './OSMMap.config';
import Map, { NavigationControl, FullscreenControl, ScaleControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Divider } from '@mantine/core';

/* * */

export default function OSMMap({
  id,
  mapStyle = 'map',
  onClick = () => {},
  onMouseMove = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  onMove = () => {},
  onMoveStart = () => {},
  onMoveEnd = () => {},
  onDrag = () => {},
  onDragStart = () => {},
  onDragEnd = () => {},
  interactiveLayerIds = [],
  scrollZoom = true,
  navigation = true,
  fullscreen = true,
  scale = true,
  children,
  toolbar,
}) {
  return (
    <div className={styles.container}>
      <Map
        id={id}
        mapLib={maplibregl}
        initialViewState={osmMapDefaults.initialViewState}
        minZoom={osmMapDefaults.styles[mapStyle].minZoom || osmMapDefaults.minZoom}
        maxZoom={osmMapDefaults.styles[mapStyle].maxZoom || osmMapDefaults.maxZoom}
        scrollZoom={scrollZoom}
        mapStyle={osmMapDefaults.styles[mapStyle] || osmMapDefaults.styles.default}
        style={{ width: '100%', height: '100%' }}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMove={onMove}
        onMoveStart={onMoveStart}
        onMoveEnd={onMoveEnd}
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        interactive={interactiveLayerIds ? true : false}
        interactiveLayerIds={interactiveLayerIds}
      >
        {navigation && <NavigationControl />}
        {fullscreen && <FullscreenControl />}
        {scale && <ScaleControl maxWidth={100} unit="metric" />}
        {children}
      </Map>
      {toolbar && <Divider />}
      {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
    </div>
  );
}
