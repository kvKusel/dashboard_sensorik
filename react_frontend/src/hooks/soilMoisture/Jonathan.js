import { useState, useEffect } from 'react';
import { fetchSoilMoistureData } from '../../chartsConfig/apiCalls';

export const useFetchSoilMoistureDataJonathan = () => {
    const [soilMoistureDataJonathan, setSoilMoistureDataJonathan] = useState(null);
    const [lastValueSoilMoistureJonathan, setLastValueSoilMoistureJonathan] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchSoilMoistureData("jonathan");
                setSoilMoistureDataJonathan(data);
                if (data && data.length > 0) {
                    // Ensure there is data and it has at least one entry
                    const lastEntry = data[data.length - 1];
                    const lastValue = parseFloat(lastEntry.value); // Parse the last value as a float
                    setLastValueSoilMoistureJonathan(lastValue); // Set the parsed float
                }
            } catch (error) {
                console.error('Failed to fetch precipitation data:', error);
            }
        };
        fetchData();
    }, []);

    return { soilMoistureDataJonathan, lastValueSoilMoistureJonathan };
};
