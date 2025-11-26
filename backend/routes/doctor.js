// backend/routes/doctor.js
const express = require('express');
const router = express.Router();
const { auth, isDoctor } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const MedicalHistory = require('../models/MedicalHistory');
const User = require('../models/User');

// Get doctor profile
router.get('/profile', auth, isDoctor, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      specialization: user.specialization,
      schedule: user.schedule
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get doctor appointments
router.get('/appointments', auth, isDoctor, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.userId })
      .populate('patient', 'name email phone age gender')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get patient medical history (only for booked appointments)
router.get('/patient/:patientId/history', auth, isDoctor, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if doctor has appointment with this patient
    const appointment = await Appointment.findOne({
      doctor: req.userId,
      patient: patientId,
      status: { $in: ['scheduled', 'completed'] }
    });

    if (!appointment) {
      return res.status(403).json({ message: 'No appointment with this patient' });
    }

    const history = await MedicalHistory.findOne({ patient: patientId });
    const patient = await User.findById(patientId).select('-password');
    
    res.json({ patient, history });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add diagnosis and prescription
router.put('/appointment/:appointmentId', auth, isDoctor, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { diagnosis, prescription, status } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: req.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.diagnosis = diagnosis || appointment.diagnosis;
    appointment.prescription = prescription || appointment.prescription;
    appointment.status = status || appointment.status;
    appointment.updatedAt = Date.now();

    await appointment.save();
    res.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update doctor schedule
router.put('/schedule', auth, isDoctor, async (req, res) => {
  try {
    const { schedule } = req.body;
    
    const user = await User.findById(req.userId);
    user.schedule = schedule;
    await user.save();

    res.json({ message: 'Schedule updated', schedule: user.schedule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;