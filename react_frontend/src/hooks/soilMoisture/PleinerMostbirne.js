import { useState, useEffect } from 'react';
import { fetchSoilMoistureData } from '../../chartsConfig/apiCalls';

export const useFetchSoilMoistureDataPleinerMostbirne = () => {
    const [soilMoistureDataPleinerMostbirne, setSoilMoistureDataPleinerMostbirne] = useState(null);
    const [lastValueSoilMoisturePleinerMostbirne, setLastValueSoilMoisturePleinerMostbirne] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchSoilMoistureData("pleiner_mostbirne");
                setSoilMoistureDataPleinerMostbirne(data);
                if (data && data.length > 0) {
                    // Ensure there is data and it has at least one entry
                    const lastEntry = data[data.length - 1];
                    const lastValue = parseFloat(lastEntry.value); // Parse the last value as a float
                    setLastValueSoilMoisturePleinerMostbirne(lastValue); // Set the parsed float
                }
            } catch (error) {
                console.error('Failed to fetch precipitation data:', error);
            }
        };
        fetchData();
    }, []);

    return { soilMoistureDataPleinerMostbirne, lastValueSoilMoisturePleinerMostbirne };
};
