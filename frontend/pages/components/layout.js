import React from 'react';
import { Container } from "react-bootstrap";
import NavbarComponent from './navbar';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
    const router = useRouter();
    const hideNavbarRoutes = ['/login', '/signup'];

    return (
        <div className="d-flex flex-column min-vh-100">
            {!hideNavbarRoutes.includes(router.pathname) && <NavbarComponent />}
            <main className="flex-grow-1">{children}</main>
                <footer className="bg-light text-center text-muted mt-5 py-3">
            <Container>
                <small>
                © 2025 StockTrade View App — Powered by Polygon.io & TradingView by Seongjun Kim
                </small>
            </Container>
            </footer>
        </div>
    )

}

export default Layout;