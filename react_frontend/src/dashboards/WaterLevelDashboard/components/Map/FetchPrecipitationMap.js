import { useEffect } from "react";

const RadarFetcher = ({ setRadarUrl, timeType, frameIndex }) => {
  useEffect(() => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((response) => response.json())
      .then((data) => {
        const frame = timeType === "past" ? data.radar.past[frameIndex] : data.radar.nowcast[frameIndex];
        const colorScheme = 3; 
        const smooth = 1;
        const snow = 0;
        setRadarUrl(`https://tilecache.rainviewer.com${frame.path}/${256}/{z}/{x}/{y}/${colorScheme}/${smooth}_${snow}.png`);
      })
      .catch((error) => console.error("Error fetching radar data:", error));
  }, [setRadarUrl, timeType, frameIndex]);

  return null;
};

export default RadarFetcher;
