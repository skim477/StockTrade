import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { readToken } from '@/lib/authenticate';
import Logout from './logout';

const NavbarComponent = () => {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = readToken();
    if (token && token.email) {
      const userEmail = token.email.split('@')[0];
      setUsername(userEmail);
    }
  },[]);

  const handleNavigation = (path) => {
    if (username) {
      router.push(`/${username}/${path}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/${username}/${searchQuery}`);
    }
  };

    return (
        <Navbar expand="lg" className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark" >
        <Container className="container-fluid">
          <Navbar.Brand>StockTrade</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleNavigation('main')}>Home</Nav.Link>
              <Nav.Link onClick={() => handleNavigation('watchlist')}>Watchlist</Nav.Link>
              <Nav.Link onClick={() => handleNavigation('autotrade')}>Auto-trade</Nav.Link>
              <NavDropdown title={username} id="basic-nav-dropdown" >
                <NavDropdown.Item >
                  <Logout />
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="ms-auto">
              <Form className="d-flex" onSubmit={handleSearchSubmit}>
                <Form.Control 
                  className="form-control me-sm-2" 
                  type="search" 
                  placeholder="Search by Symbol" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</Button>
              </Form>
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
      );
    };


export default NavbarComponent;
