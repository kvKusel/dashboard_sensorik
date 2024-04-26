import { useState, useEffect } from 'react';
import { fetchWeatherStationData } from '../../chartsConfig/apiCalls';

export const useWeatherStationPrecipitation = () => {
    const [weatherStationPrecipitationData, setWeatherStationPrecipitationData] = useState([]);
    const [lastTimestampFormatted, setLastTimestampFormatted] = useState("");
    const [lastPrecipitationValue, setLastPrecipitationValue] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchWeatherStationData('precipitation');
                setWeatherStationPrecipitationData(data);
                if (data.length > 0) {
                    const lastEntry = data[data.length - 1];
                    
                    const lastTimestampAsDate = new Date(lastEntry.time);
                    const formattedTimestamp = `${("0" + lastTimestampAsDate.getDate()).slice(-2)}/${("0" + (lastTimestampAsDate.getMonth() + 1)).slice(-2)}/${lastTimestampAsDate.getFullYear()} um ${("0" + lastTimestampAsDate.getHours()).slice(-2)}:${("0" + lastTimestampAsDate.getMinutes()).slice(-2)}`;
                    setLastTimestampFormatted(formattedTimestamp);
                    
                    setLastPrecipitationValue(lastEntry.value);
                }
            } catch (error) {
                console.error('Failed to fetch precipitation data:', error);
            }
        };

        fetchData();
    }, []);

    return { weatherStationPrecipitationData, lastTimestampFormatted, lastPrecipitationValue };
};
