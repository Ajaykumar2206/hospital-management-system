// backend/routes/appointment.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Get all doctors
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name specialization schedule');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available slots for a doctor
router.get('/slots/:doctorId/:date', auth, async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get day of week
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Find doctor's schedule for that day
    const daySchedule = doctor.schedule?.find(s => s.day === dayOfWeek);
    if (!daySchedule) {
      return res.json({ availableSlots: [] });
    }

    // Get existing appointments for that day
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      },
      status: { $ne: 'cancelled' }
    });

    // Generate available slots (30-minute intervals)
    const slots = generateTimeSlots(
      daySchedule.startTime,
      daySchedule.endTime,
      daySchedule.breakStart,
      daySchedule.breakEnd,
      existingAppointments
    );

    res.json({ availableSlots: slots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, breakStart, breakEnd, existingAppointments) {
  const slots = [];
  const bookedTimes = existingAppointments.map(apt => apt.time);

  let current = convertTimeToMinutes(startTime);
  const end = convertTimeToMinutes(endTime);
  const breakStartMin = breakStart ? convertTimeToMinutes(breakStart) : null;
  const breakEndMin = breakEnd ? convertTimeToMinutes(breakEnd) : null;

  while (current < end) {
    const timeStr = convertMinutesToTime(current);
    
    // Skip if in break time
    if (breakStartMin && breakEndMin && current >= breakStartMin && current < breakEndMin) {
      current += 30;
      continue;
    }

    // Skip if already booked
    if (!bookedTimes.includes(timeStr)) {
      slots.push(timeStr);
    }

    current += 30;
  }

  return slots;
}

function convertTimeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function convertMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Book appointment
router.post('/book', auth, async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    const appointment = new Appointment({
      patient: req.userId,
      doctor: doctorId,
      date: new Date(date),
      time,
      reason
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update appointment
router.put('/:appointmentId', auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, time, reason } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: req.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot update completed appointment' });
    }

    // Check if new slot is available
    if (date && time) {
      const existingAppointment = await Appointment.findOne({
        doctor: appointment.doctor,
        date: new Date(date),
        time,
        status: { $ne: 'cancelled' },
        _id: { $ne: appointmentId }
      });

      if (existingAppointment) {
        return res.status(400).json({ message: 'Slot already booked' });
      }

      appointment.date = new Date(date);
      appointment.time = time;
    }

    if (reason) appointment.reason = reason;
    appointment.updatedAt = Date.now();

    await appointment.save();
    res.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel appointment
router.delete('/:appointmentId', auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: req.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    appointment.updatedAt = Date.now();
    await appointment.save();

    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;