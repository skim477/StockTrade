import { useEffect, useRef } from 'react';

const TradingViewTickerTape = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        symbols: [
        { proName: "NASDAQ:MSFT", title: "Microsoft" },
        { proName: "NASDAQ:GOOGL", title: "Alphabet" },
        { proName: "NASDAQ:AAPL", title: "Apple" },
        { proName: "NASDAQ:TSLA", title: "Tesla" },
        { proName: "NYSE:JPM", title: "JPMorgan Chase" },
        { proName: "NYSE:BAC", title: "Bank of America" },
        { proName: "NYSE:JNJ", title: "Johnson & Johnson" },
        { proName: "NYSE:PFE", title: "Pfizer" },
        { proName: "TSX:RY", title: "Royal Bank of Canada" },
        { proName: "TSX:TD", title: "Toronto-Dominion Bank" },
        { proName: "TSX:BMO", title: "Bank of Montreal" },
        { proName: "TSX:BNS", title: "Bank of Nova Scotia" },
        { proName: "TSX:ENB", title: "Enbridge" },
        { proName: "TSX:SU", title: "Suncor Energy" },
        { proName: "TSX:T", title: "Telus" }
        ],
      colorTheme: "light",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en"
    });
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef}></div>
  );
};

export default TradingViewTickerTape;