import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = ({ tokenUsage, setTokenUsage }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTokenUsage = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chat/token-usage', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Token usage:', response.data.tokensUsed);
        setTokenUsage(response.data.tokensUsed);
        if (response.data.tokensUsed >= 900 && response.data.tokensUsed < 1000) {
          setWarning('You are approaching your daily token limit.');
        } else if (response.data.tokensUsed >= 1000) {
          setWarning('You have reached your daily token limit.');
        }
      } catch (error) {
        console.log('Error fetching token usage:', error);
      }
    };

    fetchTokenUsage();

    socket.on('message', (data) => {
      console.log('New message received:', data);
      setChatHistory((prev) => [...prev, data]);
      setTokenUsage(data.tokensUsed);
      if (data.tokensUsed >= 900 && data.tokensUsed < 1000) {
        setWarning('You are approaching your daily token limit.');
      } else if (data.tokensUsed >= 1000) {
        setWarning('You have reached your daily token limit.');
      }
    });

    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, [token, navigate, setTokenUsage]);

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Message sent:', response.data);
      socket.emit('message', response.data);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error sending message. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenUsage');
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="8">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-end mb-3">
                <Button variant="link" onClick={handleChangePassword}>Change Password</Button>
                <Button variant="link" onClick={handleLogout}>Logout</Button>
              </div>
              <Card.Title className="text-center">Chat with AI</Card.Title>
              <Form.Group>
                <Form.Label>Message</Form.Label>
                <Form.Control
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                />
              </Form.Group>
              <Button className="mt-3" onClick={handleSendMessage}>Send</Button>
              {error && <p className="text-danger mt-3">{error}</p>}
              {warning && <Alert variant="warning" className="mt-3">{warning}</Alert>}
              <div className="chat-history mt-3">
                {chatHistory.map((chat, index) => (
                  <div key={index}>
                    <p><strong>You:</strong> {chat.message}</p>
                    <p><strong>AI:</strong> {chat.response}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3">Tokens Used Today: {tokenUsage}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
