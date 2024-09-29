import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '@/lib/authenticate';

const useStockData = (ticker) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    const date = new Date();
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth()+1).padStart(2, '0');
    let year = date.getFullYear();

    let from_date = new Date();
    from_date.setMonth(from_date.getMonth() - 6);
    let fromDay = String(from_date.getDate()).padStart(2, '0');
    let fromMonth = String(from_date.getMonth() + 1).padStart(2, '0');
    let fromYear = from_date.getFullYear();

    let multiplier = '1';
    let timespan = 'day';

    //const FROM = '2024-01-05';
    const FROM = `${fromYear}-${fromMonth}-${fromDay}`;
    //const TO = '2024-09-13';
    const TO = `${year}-${month}-${day}`;

    try {
      const token = getToken(); // Get JWT token
      const response = await axios.get(`http://localhost:8080/api/stock/${ticker}?multiplier=${multiplier}&timespan=${timespan}&from=${FROM}&to=${TO}`, {
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
      console.error('Error fetching data from Polygon.io:', error.response ? error.response.data : error.message);
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
  }, [ticker]); //re-run when the ticker changes

  return { stockData, loading, error };
};

export default useStockData;