import { useState, useEffect } from 'react';
import { fetchWeatherStationData } from '../../chartsConfig/apiCalls';

export const useWeatherStationWindDirection = () => {
    const [lastValueWeatherStationWindDirection, setLastValueWeatherStationWindDirection] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchWeatherStationData('wind_direction');
                if (data.length > 0) {
                    const lastEntry = data[data.length - 1];
                    setLastValueWeatherStationWindDirection(lastEntry.value);
                }
            } catch (error) {
                console.error('Failed to fetch wind direction data:', error);
            }
        };

        fetchData();
    }, []);

    return lastValueWeatherStationWindDirection;
};
