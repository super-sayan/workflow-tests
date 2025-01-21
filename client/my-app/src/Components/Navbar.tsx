import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {  

    return (
    
      <Navbar collapseOnSelect sticky="top" expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>Feedbacker</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Main</Nav.Link>
            <Nav.Link href="/Survey">Take a Survey</Nav.Link>
            <Nav.Link href="/Stats">My Surveys</Nav.Link>
            <Nav.Link href="/CreateNew">Create New Survey</Nav.Link>
            <Nav.Link href="/LogOut">Log Out</Nav.Link>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    
    );
}

export default NavBar;