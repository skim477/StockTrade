import { useEffect, useRef } from 'react';

const TradingViewChart = ({symbol}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;

      script.onload = () => {
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
      };

      containerRef.current.appendChild(script);
    }
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" >
      <div id="tradingview_chart" ref={containerRef}></div>
    </div>
  );
};

export default TradingViewChart;