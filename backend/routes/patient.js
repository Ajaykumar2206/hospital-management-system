// backend/routes/patient.js
const express = require('express');
const router = express.Router();
const { auth, isPatient } = require('../middleware/auth');
const MedicalHistory = require('../models/MedicalHistory');
const Appointment = require('../models/Appointment');

// Get patient profile
router.get('/profile', auth, isPatient, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      address: user.address
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get medical history
router.get('/medical-history', auth, isPatient, async (req, res) => {
  try {
    const history = await MedicalHistory.findOne({ patient: req.userId });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update medical history
router.put('/medical-history', auth, isPatient, async (req, res) => {
  try {
    const { bloodGroup, allergies, chronicConditions, pastSurgeries, medications, familyHistory, notes } = req.body;
    
    let history = await MedicalHistory.findOne({ patient: req.userId });
    
    if (!history) {
      history = new MedicalHistory({ patient: req.userId });
    }

    history.bloodGroup = bloodGroup || history.bloodGroup;
    history.allergies = allergies || history.allergies;
    history.chronicConditions = chronicConditions || history.chronicConditions;
    history.pastSurgeries = pastSurgeries || history.pastSurgeries;
    history.medications = medications || history.medications;
    history.familyHistory = familyHistory || history.familyHistory;
    history.notes = notes || history.notes;
    history.updatedAt = Date.now();

    await history.save();
    res.json({ message: 'Medical history updated', history });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get patient appointments
router.get('/appointments', auth, isPatient, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.userId })
      .populate('doctor', 'name specialization')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;