import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../img/logoRR.png';
import { Navbar, Container, Nav } from 'react-bootstrap';


const NavApp = () => {
  return (
    <Navbar bg="light" expand="md">
      <Container>
        <Navbar.Brand href="/dashboard" className="fs-1">
          <img src={logo} alt="Logo" width="50" height="50" className="d-inline-block align-text-top me-2" />
          ReadRumble
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className='fs-5' as={NavLink} to="/dashboard" exact>
              Home
            </Nav.Link>
            <Nav.Link className='fs-5' as={NavLink} to="/explore">
              Explore
            </Nav.Link>
            <Nav.Link className='fs-5' as={NavLink} to="/profile">
              Profile
            </Nav.Link>
            <Nav.Link className='fs-5' as={NavLink} to="/logout">
             Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavApp;
