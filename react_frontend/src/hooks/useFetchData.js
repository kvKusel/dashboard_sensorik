import { useState, useEffect } from 'react';

function FetchData(apiFunc, params) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const result = await apiFunc(params);
        setData(result);
      } catch (err) {
        setError(err);
        console.error('Error fetching data:', err);
      }
      setIsLoading(false);
    }

    fetchData();
  }, [apiFunc, params]); 

  return { data, isLoading, error };
}

export default FetchData; 