import { useEffect, useRef, useState } from 'react';
import { Container, Alert } from 'react-bootstrap';

const TradingViewChart = ({symbol}) => {
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    try {
          if (containerRef.current) {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;

            script.onload = () => {
              try {
                new window.TradingView.widget({
                  container_id: containerRef.current.id,
                  autosize: false,
                  symbol: symbol, // e.g., 'AAPL'
                  interval: 'D',
                  timezone: 'Etc/UTC',
                  theme: 'light',
                  style: '1',
                  locale: 'en',
                  toolbar_bg: '#f1f3f6',
                  enable_publishing: false,
                  allow_symbol_change: true,
                  save_image: false,
                  details: true,
                  width: "100%",
                  height: "500px",
                });
              } catch (error) {
                setError('Failed to initialize TradingView widget')
                console.error(error);
              }

            };

      containerRef.current.appendChild(script);
    }
    } catch (error) {
      setError(error.message);
      console.error(error);
    }

  }, [symbol]);

  return (
    <Container>
      {error ? (
        <Alert variant='danger'>{error}</Alert>
      ) : (
        <div className="tradingview-widget-container" >
          <div id="tradingview_chart" ref={containerRef}></div>
        </div>
      )}
    </Container>
  );
};

export default TradingViewChart;