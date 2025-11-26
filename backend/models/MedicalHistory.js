// backend/models/MedicalHistory.js
const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String },
  allergies: [{ type: String }],
  chronicConditions: [{ type: String }],
  pastSurgeries: [{
    name: String,
    date: Date,
    notes: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  familyHistory: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);