// landschaft_lieben\react_frontend\src\components\Dashboard\elements\WeatherDashboard\WeatherMap.js

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup  } from "react-leaflet";
import WeatherMarkerComponent from "../WaterLevelMapMarkers";
import WeatherLegend from "../WaterLevelLegend";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


// Fix broken marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Create a custom red marker icon
const redIcon = new L.DivIcon({
  className: 'custom-marker',  // Optional: class for styling if needed
  html: '<div style="background-color: red; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white;"></div>',
  iconSize: [30, 30],  // Size of the icon
  iconAnchor: [15, 15], // Anchor point (center of the marker)
});

const PegelWolfsteinMap = () => {
  const [mapCenter, setMapCenter] = useState([49.571144, 7.62246]);
  const [mapZoom, setMapZoom] = useState(12);

  const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={false}
      className=""
      style={{ width: "100%", height: "100%", minHeight: "600px" }}
    >
      <TileLayer
        className="map-tiles"
        attribution='Map data: &copy; <a href="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">dl-de/by-2-0</a>'
        url={tileLayerUrl}
      />
      
      <Marker position={[49.581045, 7.619593]}>
      <Popup>Pegelsensor Wolfstein</Popup>

      </Marker>

                        <Marker
        position={[49.566297, 7.623804
        ]}
        popup={"Pegelsensor Rutsweiler a.d. Lauter"}
      />
                        <Marker
        position={[49.554087, 7.621883
        ]}
        popup={"Pegelsensor Kreimbach-Kaulbach"}
      />
      {/* <WeatherLegend /> */}

    </MapContainer>
  );
};

export default PegelWolfsteinMap;
