import React from 'react';
import { Container, Row, Col, Tabs, Tab, Card } from 'react-bootstrap';
import dynamic from 'next/dynamic';

const SingleTicker = dynamic(() => import('react-ts-tradingview-widgets').then((mod) => mod.SingleTicker), { ssr: false });

const technology_list = ['AAPL', 'TSLA', 'NVDA', 'META'];
const crypto_list = ['BTC', 'ETH', 'SOL', 'DOGE'];
const etf_list = ['FXI', 'SOXL', 'SPY', 'VDY'];

const Category = () => {
    const renderTickers = (tickers) => (
        <Row>
            {tickers.map((ticker, index) => (
                <Col key={index}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                {ticker} 
                            </Card.Title>
                            <Card.Text>
                                <SingleTicker width="100%" symbol={ticker} />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );

   return (
        <Container fluid="md">
            <Tabs defaultActiveKey="technology" id="category-tabs" className="mb-3">
                <Tab eventKey="technology" title="Technology">
                    {renderTickers(technology_list)}
                </Tab>
                <Tab eventKey="etf" title="ETFs">
                    {renderTickers(etf_list)}
                </Tab>
                <Tab eventKey="crypto" title="Crypto">
                    {renderTickers(crypto_list)}
                </Tab>
            </Tabs>

        </Container>
    ); 
};
export default Category;



