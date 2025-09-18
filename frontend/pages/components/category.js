import React from 'react';
import { Container, Row, Col, Tabs, Tab, Card } from 'react-bootstrap';
import dynamic from 'next/dynamic';

const SingleTicker = dynamic(() => 
  import('react-ts-tradingview-widgets').then((mod) => mod.SingleTicker), 
  { ssr: false }
);

const us_categories = {
  "Technology (US)": ['AAPL', 'MSFT', 'NVDA', 'TSLA'],
  "Banking (US)": ['JPM', 'BAC', 'GS', 'MS'],
  "Healthcare (US)": ['JNJ', 'PFE', 'UNH', 'MRK'],
  "Energy (US)": ['XOM', 'CVX', 'SLB', 'OXY'],
};

const ca_categories = {
  "Technology (CA)": ['TSX:SHOP', 'TSX:CSU', 'TSX:KXS', 'TSX:BB'],
  "Banking (CA)": ['TSX:RY', 'TSX:TD', 'TSX:BMO', 'TSX:BNS'],
  "Energy (CA)": ['TSX:CNQ', 'TSX:SU', 'TSX:ENB', 'TSX:IMO'],
  "Telecom (CA)": ['TSX:BCE', 'TSX:T', 'TSX:RCI-B', 'TSX:QBR-B'],
};

const Category = () => {
  const renderTickers = (tickers) => (
    <Row>
      {tickers.map((ticker, index) => (
        <Col key={index} xs={12} md={6} lg={3} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>{ticker}</Card.Title>
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
      <Tabs defaultActiveKey="us" id="region-tabs" className="mb-3">
        
        {/* U.S. Markets */}
        <Tab eventKey="us" title="United States">
          <Tabs defaultActiveKey="Technology (US)" className="mb-3">
            {Object.entries(us_categories).map(([category, tickers]) => (
              <Tab key={category} eventKey={category} title={category}>
                {renderTickers(tickers)}
              </Tab>
            ))}
          </Tabs>
        </Tab>

        {/* Canadian Markets */}
        <Tab eventKey="ca" title="Canada">
          <Tabs defaultActiveKey="Banking (CA)" className="mb-3">
            {Object.entries(ca_categories).map(([category, tickers]) => (
              <Tab key={category} eventKey={category} title={category}>
                {renderTickers(tickers)}
              </Tab>
            ))}
          </Tabs>
        </Tab>

      </Tabs>
    </Container>
  );
};

export default Category;