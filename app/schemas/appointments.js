var mongoose = require('mongoose');
var appointments = new mongoose.Schema({
  symptoms: String,
  department: String,
  date: Date,
  visitHour: Number,
  visitMinutes: Number,
  patientId: String,
  status: String,
  statusMessage: String,
  doctorId: String,
});

module.exports = appointments;
