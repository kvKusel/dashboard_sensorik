// landschaft_lieben\react_frontend\src\components\Dashboard\elements\WeatherDashboard\WeatherLegend.js

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import weatherStationIcon from '../../../../assets/weatherstation.svg'; // Adjust the path as needed

const WeatherLegend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend"); // Use the CSS class
      div.innerHTML += `<img src="${weatherStationIcon}" alt="Weather Station" style="width: 32px; height: 32px; " />`;
      div.innerHTML += `<span style="margin-left: 5px;">Wetterstationen</span>`;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

export default WeatherLegend;
