import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || { email: '' };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/change-password', { email, password });
      navigate('/login');
    } catch (error) {
      setError('Error changing password. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="4">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Change Password</Card.Title>
              <Form onSubmit={handleChangePassword}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    disabled
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    required
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    required
                  />
                </Form.Group>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Change Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;
