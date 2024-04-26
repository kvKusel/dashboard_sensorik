import { useState, useEffect } from 'react';
import { fetchResistanceData } from '../../chartsConfig/apiCalls';

export const useFetchResistanceDataCoxOrangenrenette = () => {
    const [resistanceDataCoxOrangenrenette, setResistanceDataCoxOrangenrenette] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchResistanceData("cox_orangenrenette");
                setResistanceDataCoxOrangenrenette(data);
            } catch (error) {
                console.error('Failed to fetch resistance data:', error);
            }
        };
        fetchData();
    }, []);

    return resistanceDataCoxOrangenrenette;
};
