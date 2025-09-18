import React, { useState, useEffect } from 'react';
import News from "../components/news";
import { Container, Row, Col, Button } from 'react-bootstrap';
import TradingviewMiniChart from '../components/tradingviewMiniChart';
import TradingviewTapeChart from '../components/tradingviewTapeChart';
import { getToken, readToken } from '@/lib/authenticate';
import { useRouter } from 'next/router';
import Category from '../components/category';

const Main = () => {

  const [showGainersLosers, setShowGainersLosers] = useState(true);
  //const { stockData, loading, error } = UseStockData('AAPL');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    const verifyToken = () => {
      if (!username) {
        // Wait for `username` to be available in `router.query`
        return;
      }

      const token = getToken();
      if (!token) {
        router.push('/login');
      } 

      try {
        // Decode the token to get the email or username
        const userData = readToken(); // readToken decodes the JWT
        const loggedInUsername = userData.email.split('@')[0]; // Extract username from email

        // Check if the username in the URL matches the logged-in username
        if (loggedInUsername !== username) {
          router.push('/login'); // Redirect to login if not matching
        } else {
          setLoading(false); // Set loading to false only if token is verified
        }
      } catch (error) {
        console.error(error);
        router.push('/login');
      }
    };

    verifyToken();
  }, [router, username]);

  const handleButtonClick = () => {
    setShowGainersLosers(!showGainersLosers);
  }

  //if (error) return <p>Error: {error}</p>;
  if (loading) return <p>Loading...</p>;

    return (
        <Container fluid="md">
          <Row className='m-3'>
            <h2>Welcome, {username}</h2>
          </Row>
          <Row className='mb-3'>
            <Col xs={12} lg={12}>
              <TradingviewTapeChart />
            </Col>
            <Col xs={12} lg={6}>
              <TradingviewMiniChart symbol='NASDAQ:IXIC'/>
            </Col>
            <Col xs={12} lg={6}>
              <TradingviewMiniChart symbol='TSX'/>
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col xs={12}>
              <Category />
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



export default Main;