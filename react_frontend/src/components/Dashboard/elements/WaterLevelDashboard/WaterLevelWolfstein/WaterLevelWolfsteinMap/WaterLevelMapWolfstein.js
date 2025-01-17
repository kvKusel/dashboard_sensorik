import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import WeatherLegend from "../../WaterLevelLegend";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import RainIntensityLegend from "./WolfsteinLegend";
import RadarFetcher from "./FetchPrecipitationMap"; // Import the new component

// Fix broken marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Create a custom red marker icon
const redIcon = new L.DivIcon({
  className: "custom-marker", // Optional: class for styling if needed
  html: '<div style="background-color: red; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white;"></div>',
  iconSize: [30, 30], // Size of the icon
  iconAnchor: [15, 15], // Anchor point (center of the marker)
});

const PegelWolfsteinMap = () => {
  const [mapCenter] = useState([49.571144, 7.62246]);
  const [mapZoom] = useState(10);

  const tileLayerUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  const [timeType, setTimeType] = useState("past"); // Default to 'past'
  const [frameIndex, setFrameIndex] = useState(8); // Default to 8 (current time)
  const [radarUrl, setRadarUrl] = useState("");

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%", minHeight: "600px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={tileLayerUrl}
      />

      <RadarFetcher
        setRadarUrl={setRadarUrl}
        timeType={timeType}
        frameIndex={frameIndex}
      />
      
      {radarUrl && (
        <TileLayer
          url={radarUrl}
          attribution='&copy; <a href="https://rainviewer.com" target="_blank">RainViewer</a>'
          opacity={0.5}
        />
      )}

      <Marker position={[49.581045, 7.619593]}>
        <Popup>Pegelsensor Wolfstein</Popup>
      </Marker>
      <Marker position={[49.566297, 7.623804]}>
        <Popup>Pegelsensor Rutsweiler a.d. Lauter</Popup>
      </Marker>
      <Marker position={[49.554087, 7.621883]}>
        <Popup>Pegelsensor Kreimbach-Kaulbach</Popup>
      </Marker>
      <RainIntensityLegend
        timeType={timeType}
        setTimeType={setTimeType}
        frameIndex={frameIndex}
        setFrameIndex={setFrameIndex}
      />
    </MapContainer>
  );
};

export default PegelWolfsteinMap;
