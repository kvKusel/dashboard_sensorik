// landschaft_lieben\react_frontend\src\components\Dashboard\elements\WeatherDashboard\WeatherMap.js

import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import WeatherMarkerComponent from "./WeatherMapMarkers";
import WeatherLegend from "./WeatherLegend";
import "leaflet/dist/leaflet.css";

const WeatherMap = () => {
  const [mapCenter, setMapCenter] = useState([49.551053, 7.379036]);
  const [mapZoom, setMapZoom] = useState(13);

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
        position={[49.55763383926781, 7.36134283963924]}
        popup={"Wetterstation Burg Lichtenberg"}
      />
      <WeatherMarkerComponent
        position={[49.543239, 7.391181]}
        popup={"Wetterstation Siebenpfeiffer Gymnasium"}
      />
      <WeatherLegend />
    </MapContainer>
  );
};

export default WeatherMap;
