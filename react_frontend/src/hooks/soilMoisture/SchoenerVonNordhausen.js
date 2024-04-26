import { useState, useEffect } from 'react';
import { fetchSoilMoistureData } from '../../chartsConfig/apiCalls';

export const useFetchSoilMoistureDataSchoenerVonNordhausen = () => {
    const [soilMoistureDataSchoenerVonNordhausen, setSoilMoistureDataSchoenerVonNordhausen] = useState(null);
    const [lastValueSoilMoistureSchoenerVonNordhausen, setLastValueSoilMoistureSchoenerVonNordhausen] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchSoilMoistureData("schoener_von_nordhausen");
                setSoilMoistureDataSchoenerVonNordhausen(data);
                if (data && data.length > 0) {
                    // Ensure there is data and it has at least one entry
                    const lastEntry = data[data.length - 1];
                    const lastValue = parseFloat(lastEntry.value); // Parse the last value as a float
                    setLastValueSoilMoistureSchoenerVonNordhausen(lastValue); // Set the parsed float
                }
            } catch (error) {
                console.error('Failed to fetch precipitation data:', error);
            }
        };
        fetchData();
    }, []);

    return { soilMoistureDataSchoenerVonNordhausen, lastValueSoilMoistureSchoenerVonNordhausen };
};
