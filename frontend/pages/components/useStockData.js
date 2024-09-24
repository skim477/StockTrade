import { useEffect, useState } from 'react';
import axios from 'axios';

const date = new Date();
let day = String(date.getDate()).padStart(2, '0');
let month = String(date.getMonth()+1).padStart(2, '0');
let year = date.getFullYear();

let from_date = new Date();
from_date.setMonth(from_date.getMonth() - 6);
let fromDay = String(from_date.getDate()).padStart(2, '0');
let fromMonth = String(from_date.getMonth() + 1).padStart(2, '0');
let fromYear = from_date.getFullYear();

const POLYGON_API_KEY = 'H8pwcjAJyG8SbWTtN_HFmaVvNznEsHgc'; // Replace with your Polygon.io API key
const TICKER = 'AAPL';
const MULTIPLIER = '1';
const TIMESPAN = 'day';
//const FROM = '2024-01-05';
const FROM = `${fromYear}-${fromMonth}-${fromDay}`;
//const TO = '2024-09-13';
const TO = `${year}-${month}-${day}`;
const POLYGON_URL = `https://api.polygon.io/v2/aggs/ticker/${TICKER}/range/${MULTIPLIER}/${TIMESPAN}/${FROM}/${TO}?apiKey=${POLYGON_API_KEY}`;

const useStockData = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    try {
      const response = await axios.get(POLYGON_URL);
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