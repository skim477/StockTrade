import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '@/lib/authenticate';

const useStockData = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {

    try {
      const token = getToken(); // Get JWT token
      const response = await axios.get('http://localhost:8080/api/stock-data', {
        headers: {
          Authorization: `JWT ${token}`
        }
      });
      const result = response.data.results || [];
      const formattedStockData = result.map(item => ({
        date: new Date(item.t).toLocaleDateString(),
        open: item.o,
        close: item.c,
      }));
      return formattedStockData;
    } catch (error) {
      console.error('Error fetching data from Polygon.io:', error);
      throw new Error('Error fetching stock data');
    }
  } 

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      try {
        const fetchedData = await fetchStockData();
        setStockData(fetchedData);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return { stockData, loading, error };
};

export default useStockData;