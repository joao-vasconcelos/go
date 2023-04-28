import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const OpenStreetMap = ({ children }) => {
  const [center, setCenter] = useState({ lat: 38.605, lng: -9.0 });
  const ZOOM_LEVEL = 9;
  const mapRef = useRef();

  return (
    <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url='https://maps.carrismetropolitana.pt/styles/default/{z}/{x}/{y}.png' />
      {children}
    </MapContainer>
  );
};

export default OpenStreetMap;
