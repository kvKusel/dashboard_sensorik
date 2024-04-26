import { useState, useEffect } from 'react';
import { fetchWeatherStationData } from '../../chartsConfig/apiCalls';

export const useWeatherStationTemperature = () => {
    const [weatherStationTemperatureData, setWeatherStationTemperatureData] = useState([]);
    const [lastValueWeatherStationTemperature, setLastValueWeatherStationTemperature] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchWeatherStationData('temperature');
                setWeatherStationTemperatureData(data);
                if (data.length > 0) {
                    let lastValidIndex = data.length - 1;

                    // Check if the value in the last entry is null, if so, try the previous entries
                    while (lastValidIndex >= 0 && (data[lastValidIndex].value === null || data[lastValidIndex].value === undefined)) {
                        lastValidIndex -= 1;
                    }

                    // If a valid entry is found, set its value
                    if (lastValidIndex >= 0) {
                        setLastValueWeatherStationTemperature(data[lastValidIndex].value);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch temperature data:', error);
            }
        };

        fetchData();
    }, []);

    return { weatherStationTemperatureData, lastValueWeatherStationTemperature };
};
