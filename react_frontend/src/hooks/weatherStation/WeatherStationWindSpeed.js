import { useState, useEffect } from 'react';
import { fetchWeatherStationData } from '../../chartsConfig/apiCalls';

export const useWeatherStationWindSpeed = () => {
    const [lastValueWeatherStationWindSpeed, setLastValueWeatherStationWindSpeed] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchWeatherStationData('wind_speed');
                if (data.length > 0) {
                    const lastEntry = data[data.length - 1];
                    setLastValueWeatherStationWindSpeed(lastEntry.value);
                }
            } catch (error) {
                console.error('Failed to fetch wind speed data:', error);
            }
        };

        fetchData();
    }, []);

    return lastValueWeatherStationWindSpeed;
};
