import osmMapDefaults from './OSMMap.config';
import Map, { NavigationControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function OSMMap({ id, mapStyle, width, height, scrollZoom = true, children }) {
  return (
    <div>
      <Map
        id={`${id}Map`}
        mapLib={maplibregl}
        initialViewState={osmMapDefaults.initialViewState}
        minZoom={osmMapDefaults.minZoom}
        maxZoom={osmMapDefaults.maxZoom}
        scrollZoom={scrollZoom}
        mapStyle={osmMapDefaults.styles[mapStyle] || osmMapDefaults.styles.default}
        style={{ width: width || '100%', height: height || '100%' }}
      >
        <NavigationControl />
        {children}
      </Map>
    </div>
  );
}
