import Layout from '@/pages/components/layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootswatch/dist/minty/bootstrap.min.css";
import Script from 'next/script';
//import NavbarComponent from "./components/navbar";

export default function App({ Component, pageProps }) {

  return (

  <>
    <Script src="https://s3.tradingview.com/tv.js" strategy="beforeInteractive" />
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </>

  );
};
