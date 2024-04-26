import { useState, useEffect } from 'react';
import { fetchWeatherStationData } from '../../chartsConfig/apiCalls';

export const useWeatherStationAirPressure = () => {
    const [lastValueWeatherStationAirPressure, setLastValueWeatherStationAirPressure] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchWeatherStationData('air_pressure');
                if (data.length > 0) {
                    const lastEntry = data[data.length - 1];
                    setLastValueWeatherStationAirPressure(lastEntry.value);
                }
            } catch (error) {
                console.error('Failed to fetch air pressure data:', error);
            }
        };

        fetchData();
    }, []);

    return lastValueWeatherStationAirPressure;
};
