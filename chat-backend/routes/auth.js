const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smpt.gmail.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTPEmail = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        const otp = generateOTP();
        existingUser.otp = otp;
        await existingUser.save();
        sendOTPEmail(email, otp);
        return res.status(200).send('User already exists. OTP sent to verify email.');
      } else {
        return res.status(400).send('User already exists and is verified.');
      }
    }

    const otp = generateOTP();
    const user = new User({ email, password, otp, isVerified: false });
    await user.save();
    sendOTPEmail(email, otp);
    res.status(201).send('User registered. Please verify your email.');
  } catch (error) {
    console.log('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password');

    if (!user.isVerified) return res.status(400).send('Please verify your email.');

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.log('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, otp });
    if (!user) return res.status(400).send('Invalid OTP');

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.send('User verified successfully');
  } catch (error) {
    console.log('Error verifying OTP:', error);
    res.status(500).send('Error verifying OTP');
  }
});

router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Email not found');

    if (user.isVerified) return res.status(400).send('Email is already verified');

    const otp = generateOTP();
    user.otp = otp;
    await user.save();
    sendOTPEmail(email, otp);
    res.send('OTP resent successfully');
  } catch (error) {
    console.log('Error resending OTP:', error);
    res.status(500).send('Error resending OTP');
  }
});

module.exports = router;
