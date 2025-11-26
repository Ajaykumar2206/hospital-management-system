// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MedicalHistory = require('../models/MedicalHistory');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, age, gender, address, specialization, schedule } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Default schedule for doctors if not provided
    const defaultSchedule = [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' }
    ];

    // Create user
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      age,
      gender,
      address,
      specialization: role === 'doctor' ? specialization : undefined,
      schedule: role === 'doctor' ? (schedule && schedule.length > 0 ? schedule : defaultSchedule) : undefined
    });

    await user.save();

    // Create medical history for patients
    if (role === 'patient') {
      const medicalHistory = new MedicalHistory({ patient: user._id });
      await medicalHistory.save();
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;