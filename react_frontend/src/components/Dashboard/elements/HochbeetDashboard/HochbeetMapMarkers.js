import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import weatherStationIcon from '../../../../assets/weatherstation.svg'; // Adjust the path as needed

const WeatherMarkerComponent = ({ position, popup }) => {

     
    const customIcon = new L.Icon({
        iconUrl: weatherStationIcon,
        iconSize: [28, 28], // Adjust the size as needed
        iconAnchor: [16, 32], // Adjust the anchor point as needed
        popupAnchor: [0, -32] // Adjust the popup anchor point as needed
      });

  return (
    <Marker position={position} icon={customIcon}>
    <Popup>
      {popup}
    </Popup>
  </Marker>
  );
};

export default WeatherMarkerComponent;
