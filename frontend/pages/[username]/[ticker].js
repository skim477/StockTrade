import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col } from 'react-bootstrap';
import TradingViewChart from '../components/tradingviewChart';
import Dividends from '../components/dividends';
import TickerNews from '../components/tickerNews';

const Ticker = () => {
    const router = useRouter();
    const { ticker } = router.query;
    if (!ticker) {
        return <p>Loading...</p>;
    }
    
    const symbol = ticker.toUpperCase();

    return (
        <Container fluid="md">
            <Row className='mb-3'>
                <TradingViewChart symbol={symbol}/>
            </Row>
            <Row className='mb-3'>
                <Dividends ticker={symbol} />
            </Row>
            <Row>
                <TickerNews ticker={symbol} />
            </Row>
        </Container>
    );
}

export default Ticker;