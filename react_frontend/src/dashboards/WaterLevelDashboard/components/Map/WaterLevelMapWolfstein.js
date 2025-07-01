import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, GeoJSON } from "react-leaflet"; // Import GeoJSON
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // No need for { map } from "leaflet"
import RainIntensityLegend from "../WolfsteinLegend";
import RadarFetcher from "./FetchPrecipitationMap";
import polygonLandkreisKusel from "./KuselPolygonCoords";
import CustomMapMarkers from "./CustomMapMarker";

const worldBounds = [
  [-90, -180],
  [-90, 180],
  [90, 180],
  [90, -180]
];


// Mask component to apply the effect.
const MaskLayer = () => {
  const map = useMap();

  React.useEffect(() => {
    const mask = L.polygon([worldBounds, polygonLandkreisKusel], {
      color: "black",
      fillColor: "black",
      fillOpacity: 0.5,
      stroke: false
    }).addTo(map);

    return () => {
      map.removeLayer(mask);
    };
  }, [map]);

  return null;
};

// Fix broken marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


const PegelWolfsteinMap = ({ hoveredMarkerId, selectedMarkerId, onMarkerClick, setHoveredMarkerId, setSelectedMarkerId, mapRef, mapCenter, setMapCenter, handleMarkerClick }) => {

  const [riverGeojsonData, setRiverGeojsonData] = useState(null); // State to hold your GeoJSON data


  // Effect to fetch the GeoJSON data
  useEffect(() => {
    fetch('/landkreis_kusel_fluesse_simplified.geojson') // Path to your file in the public folder
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setRiverGeojsonData(data);
      })
      .catch(error => console.error("Error fetching river GeoJSON:", error));
  }, []); // Empty dependency array means this runs once on mount


  const markers = [
    { id: "wolfstein", position: [49.581045, 7.619593], label: "Wolfstein", queryType: "lastValueWolfstein" },
    { id: "rutsweiler", position: [49.566260, 7.623804], label: "Rutsweiler a.d. Lauter", queryType: "lastValueRutsweiler" },
    { id: "kreimbach4", position: [49.554057, 7.621883], label: "Kreimbach 3", queryType: "lastValueKreimbach4" },
    { id: "lauterecken", position: [49.650457589739846, 7.590545488872102], label: "Lauterecken", queryType: "lastValueLauterecken1" },
    { id: "kreimbach1", position: [49.54848915352638, 7.631195812962766], label: "Kreimbach 1", queryType: "lastValueKreimbach1" },
    { id: "kreimbach3", position: [49.556388641429436, 7.636587365546659], label: "Kreimbach 2", queryType: "lastValueKreimbach3" },
    { id: "kusel", position: [49.539810952844316, 7.396764597634942], label: "Kusel", queryType: "lastValueKreisverwaltung" },
    { id: "lohnweiler1", position: [49.63553061963123, 7.59709411130715], label: "Lohnweiler", queryType: "lastValueLohnweiler1" },
    { id: "hinzweiler1", position: [49.589394954381816, 7.548317327514346], label: "Hinzweiler", queryType: "lastValueHinzweiler1" },
    { id: "untersulzbach", position: [49.528584, 7.663114], label: "Untersulzbach", queryType: "lastValueUntersulzbach" },
    { id: "lohnweilerRLP", position: [49.636225, 7.600307], label: "Lohnweiler (Lauter)", queryType: "lastValueLohnweilerRLP" },
    { id: "ohmbachsee", position: [49.421436, 7.382018], label: "Ohmbachsee", queryType: "lastValueOhmbachsee" },
    { id: "nanzdietschweiler", position: [49.445651, 7.443034], label: "Nanzdietschweiler", queryType: "lastValueNanzdietschweiler" },
    { id: "rammelsbach", position: [49.544549, 7.448862], label: "Rammelsbach", queryType: "lastValueRammelsbach" },
    { id: "eschenau", position: [49.599899, 7.482403], label: "Eschenau", queryType: "lastValueEschenau" },
    { id: "sulzhof", position: [49.644886, 7.620666], label: "Sulzhof", queryType: "lastValueSulzhof" },
    { id: "odenbachSteinbruch", position: [49.678306, 7.650426], label: "Odenbach / Steinbruch", queryType: "lastValueOdenbachSteinbruch" },
    { id: "odenbach", position: [49.688925, 7.652256], label: "Odenbach", queryType: "lastValueOdenbach" },
    { id: "niedermohr", position: [49.459274, 7.464442], label: "Niedermohr", queryType: "lastValueNiedermohr" },
    { id: "loellbach", position: [49.703048, 7.598709], label: "Löllbach", queryType: "lastValueLoellbach" },
    { id: "lohnweilerLauterLandLieben", position: [49.636285, 7.600367], label: "Lohnweiler (Lauter) (Sensor LANDL(i)EBEN)", queryType: "lastValueLohnweilerLauterLandLieben" }
  ];

  const [mapZoom, setMapZoom] = useState(window.innerWidth < 768 ? 10 : 11); // Zoom based on screen size

  useEffect(() => {
    const handleResize = () => {
      setMapZoom(window.innerWidth < 768 ? 10 : 11);
      const newCenter = window.innerWidth < 768
        ? [49.560444, 7.49246]
        : [49.560144, 7.49246];
      setMapCenter(newCenter);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const tileLayerUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  const [timeType, setTimeType] = useState("past"); // Default to 'past'
  const [frameIndex, setFrameIndex] = useState(8); // Default to 8 (current time)
  const [radarUrl, setRadarUrl] = useState("");

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const ResetControl = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
        container.innerHTML = "Ansicht<br>zurücksetzen";
        container.style.backgroundColor = "white";
        container.style.padding = "7px";
        container.style.fontSize = "12px";
        container.style.textAlign = "center";
        container.style.lineHeight = "1.2";
        container.style.cursor = "pointer";
        container.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
        container.style.borderRadius = "4px";
        container.title = "Zur Startansicht der Karte zurückkehren";

        container.onclick = function () {
          const resetCenter = window.innerWidth < 768
            ? [49.560444, 7.49246]
            : [49.560144, 7.49246];
          const resetZoom = window.innerWidth < 768 ? 10 : 11;

          map.setView(resetCenter, resetZoom);
        };
        return container;
      }
    });

    const resetControl = new ResetControl({ position: "topright" });
    map.addControl(resetControl);

    return () => {
      map.removeControl(resetControl);
    };
  }, [mapCenter, mapZoom, mapRef.current]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%", minHeight: "600px" }}
      ref={(mapInstance) => {
        mapRef.current = mapInstance;
      }}>
      <TileLayer
        attribution='&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={tileLayerUrl}
      />

      {/* Add Mask */}
      <MaskLayer />

      {/* Add the actual polygon outline */}
      <Polygon positions={polygonLandkreisKusel} color="transparent" fillOpacity={1} />

      {/* Render your GeoJSON river data */}
      {riverGeojsonData && (
        <GeoJSON
          data={riverGeojsonData}
          style={() => ({
            color: '#007bff', // A nice river blue
            weight: 1,         // Line thickness
            opacity: 1       // Transparency
          })}
        />
      )}

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

      <CustomMapMarkers
        markers={markers}
        hoveredMarkerId={hoveredMarkerId}
        selectedMarkerId={selectedMarkerId}
        onMarkerClick={handleMarkerClick}
        onMarkerClick2={onMarkerClick}
        setHoveredMarkerId={setHoveredMarkerId}
        setSelectedMarkerId={setSelectedMarkerId}
      />

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