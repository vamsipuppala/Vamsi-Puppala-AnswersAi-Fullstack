// src/components/Chat.js
import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email'); // Assuming the email is stored in localStorage

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password', { state: { email } });
  };

  return (
    <Container fluid>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">Chat Application</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link onClick={handleChangePassword}>Change Password</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Row className="justify-content-md-center mt-5">
        <Col md="8">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Chat Interface</Card.Title>
              <p>Chat interface will be implemented here.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
