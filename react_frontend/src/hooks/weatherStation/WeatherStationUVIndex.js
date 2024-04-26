import { useState, useEffect } from 'react';
import { fetchWeatherStationData } from '../../chartsConfig/apiCalls';

export const useWeatherStationUVIndex = () => {
    const [lastValueWeatherStationUVIndex, setLastValueWeatherStationUVIndex] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchWeatherStationData('uv_index');
                if (data.length > 0) {
                    const lastEntry = data[data.length - 1];
                    setLastValueWeatherStationUVIndex(lastEntry.value);
                }
            } catch (error) {
                console.error('Failed to fetch UV index data:', error);
            }
        };

        fetchData();
    }, []);

    return lastValueWeatherStationUVIndex;
};
