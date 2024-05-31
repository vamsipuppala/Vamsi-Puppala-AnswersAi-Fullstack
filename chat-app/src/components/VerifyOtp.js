import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setResendSuccess('');

    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      navigate('/login');
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setResendSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
      setResendSuccess('OTP resent successfully.');
    } catch (error) {
      setError('Error resending OTP. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="4">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Verify OTP</Card.Title>
              <Form onSubmit={handleVerifyOtp}>
                <Form.Group controlId="formBasicOtp">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                  />
                </Form.Group>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {resendSuccess && <Alert variant="success" className="mt-3">{resendSuccess}</Alert>}

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Verify
                </Button>
              </Form>
              <div className="text-center mt-3">
                <Button variant="link" onClick={handleResendOtp}>Resend OTP</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyOtp;
