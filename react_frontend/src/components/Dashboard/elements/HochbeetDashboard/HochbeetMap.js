// landschaft_lieben\react_frontend\src\components\Dashboard\elements\WeatherDashboard\WeatherMap.js

import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import WeatherMarkerComponent from "./HochbeetMapMarkers";
import WeatherLegend from "./HochbeetLegend";
import "leaflet/dist/leaflet.css";

const HochbeetMap = () => {
  const [mapCenter, setMapCenter] = useState([49.542842, 7.391988]);
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
        position={[49.542797, 7.392332]}
        popup={"Wachstnix"}
      />
      <WeatherMarkerComponent
        position={[49.542847, 7.392232]}
        popup={"Shoppingqueen"}
      />

<WeatherMarkerComponent
        position={[49.542887, 7.392112]}
        popup={"Kompostplatz 1"}
      />
            <WeatherMarkerComponent
        position={[49.542927, 7.392002]}
        popup={"Übersee"}
      />
                  <WeatherMarkerComponent
        position={[49.542897, 7.391882]}
        popup={"Beethoven"}
      />
                  <WeatherMarkerComponent
        position={[49.542827, 7.391802]}
        popup={"Kohlarabi"}
      />
      <WeatherLegend />

    </MapContainer>
  );
};

export default HochbeetMap;
