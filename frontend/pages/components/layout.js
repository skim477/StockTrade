import React from 'react';
import NavbarComponent from './navbar';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
    const router = useRouter();
    const hideNavbarRoutes = ['/login', '/signup'];

    return (
        <div>
            {!hideNavbarRoutes.includes(router.pathname) && <NavbarComponent />}
            {children}
        </div>
    )

}

export default Layout;