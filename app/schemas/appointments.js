var mongoose = require('mongoose');
var appointments = new mongoose.Schema({
  symptoms: String,
  department: String,
  date: Date,
  visitHour: Number,
  visitMinutes: Number,
  patientId: String,
  patientName: String,
  status: String,
  statusMessage: String,
  doctorId: String,
  doctorName: String,
  preferredDoctor: [], // The order of high priority start from 0th element.
});

module.exports = appointments;
