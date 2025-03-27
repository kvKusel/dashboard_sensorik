// landschaft_lieben\react_frontend\src\components\Dashboard\elements\WeatherDashboard\WeatherMap.js

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const EtschbergMap = () => {
  const [mapCenter, setMapCenter] = useState([49.512636, 7.426908]);
  const [mapZoom, setMapZoom] = useState(18);

  const tileLayerUrl = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";


// polygon of the study area  

  const geojsonEtschbergStudyArea = {
    type: "FeatureCollection",
    name: "burg",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: [
      {
        type: "Feature",
        properties: { id: null },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [ 7.426735478169394, 49.512643437369455 ],
                 [ 7.42699047796796, 49.512751911740523 ],
                  [ 7.427143477847098, 49.512609182254927 ],
                   [ 7.426895512525736, 49.512507558607361 ],
                    [ 7.426735478169394, 49.512643437369455 ]
              ],
            ],
          ],
        },
      },
    ],
  };

// styling for the polygon above
  const polygonStyleEtschbergStudyArea = {
    fillColor: "blue",
    weight: 2,
    opacity: 1,
    color: "blue",
    fillOpacity: 0.2,
  };


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

            <GeoJSON
              data={geojsonEtschbergStudyArea}
              style={polygonStyleEtschbergStudyArea}
            />
      
  

    </MapContainer>
  );
};

export default EtschbergMap;
