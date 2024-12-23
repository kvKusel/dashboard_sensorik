import { useEffect } from "react";

const RadarFetcher = ({ setRadarUrl }) => {
  useEffect(() => {
    // Fetch radar data from RainViewer API
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((response) => response.json())
      .then((data) => {
        const frame = data.radar.nowcast[0]; // Example for past radar data
        const colorScheme = 3; // From 0 to 8
        const smooth = 1; // 0 for no smoothing, 1 for smoothing
        const snow = 0; // 0 for no snow colors, 1 for snow colors
        setRadarUrl(`https://tilecache.rainviewer.com${frame.path}/${256}/{z}/{x}/{y}/${colorScheme}/${smooth}_${snow}.png`);
      })
      .catch((error) => console.error("Error fetching radar data:", error));
  }, [setRadarUrl]);

  return null; // This component doesn't render anything
};

export default RadarFetcher;
