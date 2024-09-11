import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
const NavbarComponent = () => {

    return (
        <Navbar expand="lg" className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark" >
        <Container className="container-fluid">
          <Navbar.Brand href="#home">StockTrade</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#watchlist">Watchlist</Nav.Link>
              <Nav.Link href="#auto-trade">Auto-trade</Nav.Link>
              <NavDropdown title="Account" id="basic-nav-dropdown" >
                <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="ms-auto">
              <Form className="d-flex">
                <Form.Control className="form-control me-sm-2" type="search" placeholder="Search" />
                <Button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</Button>
              </Form>
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
      );
    };


export default NavbarComponent;