// landschaft_lieben\react_frontend\src\components\Dashboard\elements\WeatherDashboard\WeatherMap.js

import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import WeatherMarkerComponent from "../WaterLevelMapMarkers";
import WeatherLegend from "../WaterLevelLegend";
import "leaflet/dist/leaflet.css";

const HochbeetMap = () => {
  const [mapCenter, setMapCenter] = useState([49.539762, 7.396774]);
  const [mapZoom, setMapZoom] = useState(18);

  const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={false}
      className=""
      style={{ width: "100%", height: "100%", minHeight: "300px" }}
    >
      <TileLayer
        className="map-tiles"
        attribution='Map data: &copy; <a href="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">dl-de/by-2-0</a>'
        url={tileLayerUrl}
      />
      
                  <WeatherMarkerComponent
        position={[49.539799, 7.396744


        ]}
        popup={"Pegelsensor Kreisverwaltung"}
      />
      <WeatherLegend />

    </MapContainer>
  );
};

export default HochbeetMap;
