import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import ChangePassword from './components/ChangePassword';
import VerifyOtp from './components/VerifyOtp';

const App = () => {
  const [tokenUsage, setTokenUsage] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setTokenUsage={setTokenUsage} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ProtectedRoute component={Chat} tokenUsage={tokenUsage} setTokenUsage={setTokenUsage} />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/" element={<Login setTokenUsage={setTokenUsage} />} />
      </Routes>
    </Router>
  );
};

export default App;
