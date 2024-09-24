import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TradingviewChart from './components/tradingviewChart';

const AutoTrade = () => {

  return (
    <Container fluid="md" className="mt-5">
        <Row>
            <Col xs={12}>
                <TradingviewChart />
            </Col>

        </Row>
        
    </Container>
  );

};

export default AutoTrade;