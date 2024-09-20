import TopGainersLosers from "./components/topGainersLosers";
import News from "./components/news";
import { Container, Row, Col, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import StockChart from "./components/chart";
import UseStockData from './components/useStockData';

const Home = () => {

  const [showGainersLosers, setShowGainersLosers] = useState(false);
  const { stockData, loading, error } = UseStockData();

  const handleButtonClick = () => {
    setShowGainersLosers(!showGainersLosers);
  }

  if (loading) return <p>Loading stock data...</p>;
  if (error) return <p>Error: {error}</p>;

    return (
        <Container fluid="md">
          <Row className='mb-3'>
            <Col xs={12} lg={8}><StockChart data={stockData} /></Col>
            <Col xs={12} lg={4}>
              <Button onClick={handleButtonClick} className="mb-3 mt-3 w-100">
                {showGainersLosers ? "Hide Top Gainers/Top Losers/Most Active" :  "Show Top Gainers / Top Losers / Most Active"}
              </Button>
              {showGainersLosers && (<TopGainersLosers />)}
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <News />
            </Col>
          </Row>
        </Container>
    );
};



export default Home;