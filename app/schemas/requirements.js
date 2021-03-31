var mongoose = require('mongoose');
var requires = new mongoose.Schema({
  symptoms: String,
  department: String,
  date: Date,
  time: String,
  patientId: String,
  status: String,
  statusMessage: String,
  doctorId: String,
});

module.exports = requires;
