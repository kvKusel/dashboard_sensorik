// landschaft_lieben\react_frontend\src\components\Dashboard\elements\WeatherDashboard\WeatherMap.js

import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const EtschbergMap = () => {
  const [mapCenter, setMapCenter] = useState([49.512636, 7.426908]);
  const [mapZoom, setMapZoom] = useState(18);

  const tileLayerUrl = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";

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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        url={tileLayerUrl}
      />
      
  

    </MapContainer>
  );
};

export default EtschbergMap;
