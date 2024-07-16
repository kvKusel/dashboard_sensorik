import { useState, useEffect } from 'react';
import { fetchTreeMoistureContentData } from '../../chartsConfig/apiCalls';

export const useFetchTreeMoistureContentDataCoxOrangenrenette = () => {
    const [treeMoistureContentDataCoxOrangenrenette, setTreeMoistureContentDataCoxOrangenrenette] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTreeMoistureContentData("cox_orangenrenette");
                setTreeMoistureContentDataCoxOrangenrenette(data);
            } catch (error) {
                console.error('Failed to fetch tree moisture content data:', error);
            }
        };
        fetchData();
    }, []);

    return treeMoistureContentDataCoxOrangenrenette;
};
