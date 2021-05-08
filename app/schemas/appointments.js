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
  preferredDoctor: [], // The order of high priority start from 0th element.
});

module.exports = appointments;
