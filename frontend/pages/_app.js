import Layout from '@/pages/components/layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootswatch/dist/minty/bootstrap.min.css";
//import NavbarComponent from "./components/navbar";

export default function App({ Component, pageProps }) {

  return (

  <>
    <Layout>
    <Component {...pageProps} />
    </Layout>
  </>

  );
};
