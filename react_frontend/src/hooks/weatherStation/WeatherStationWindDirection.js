import { useState, useEffect } from 'react';
import { fetchWeatherStationData } from '../../chartsConfig/apiCalls';

const getCardinalDirection = (degree) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degree / 45) % 8;
  return directions[index];
};

export const useWeatherStationWindDirection = () => {
  const [lastValueWeatherStationWindDirection, setLastValueWeatherStationWindDirection] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeatherStationData('wind_direction');
        if (data.length > 0) {
          const lastEntry = data[data.length - 1];
          const cardinalDirection = getCardinalDirection(lastEntry.value);
          setLastValueWeatherStationWindDirection(cardinalDirection);
        }
      } catch (error) {
        console.error('Failed to fetch wind direction data:', error);
      }
    };

    fetchData();
  }, []);

  return lastValueWeatherStationWindDirection;
};
