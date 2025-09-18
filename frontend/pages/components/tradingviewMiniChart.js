import { useEffect, useRef } from 'react';

const TradingViewMiniChart = ({ symbol }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,        // e.g. "NASDAQ:AAPL"
      width: "100%",
      height: "220",
      locale: "en",
      dateRange: "1M",
      colorTheme: "light",
      trendLineColor: "#37a6ef",
      underLineColor: "#E3F2FD",
      isTransparent: false
    });
    containerRef.current.innerHTML = ""; // clear previous
    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}></div>
  );
};

export default TradingViewMiniChart;