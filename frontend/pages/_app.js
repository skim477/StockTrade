
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootswatch/dist/minty/bootstrap.min.css";
import NavbarComponent from "./components/navbar";

export default function App({ Component, pageProps }) {

  return (

  <>
    <NavbarComponent />
    <Component {...pageProps} />
  </>

  );
};
