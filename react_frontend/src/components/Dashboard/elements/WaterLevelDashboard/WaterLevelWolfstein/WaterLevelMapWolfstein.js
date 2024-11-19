// landschaft_lieben\react_frontend\src\components\Dashboard\elements\WeatherDashboard\WeatherMap.js

import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import WeatherMarkerComponent from "../WaterLevelMapMarkers";
import WeatherLegend from "../WaterLevelLegend";
import "leaflet/dist/leaflet.css";

const PegelWolfsteinMap = () => {
  const [mapCenter, setMapCenter] = useState([49.571144, 7.62246]);
  const [mapZoom, setMapZoom] = useState(13);

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
      
                  <WeatherMarkerComponent
        position={[49.581045, 7.619593
        ]}
        popup={"Pegelsensor Wolfstein"}
      />
                        <WeatherMarkerComponent
        position={[49.566297, 7.623804
        ]}
        popup={"Pegelsensor Rutsweiler a.d. Lauter"}
      />
                        <WeatherMarkerComponent
        position={[49.554087, 7.621883
        ]}
        popup={"Pegelsensor Kreimbach-Kaulbach"}
      />
      <WeatherLegend />

    </MapContainer>
  );
};

export default PegelWolfsteinMap;
