var mongoose = require('mongoose');

var doctorWorkitem = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  department: String,
  age: Number,
  gender: String,
  availableFromHour: Number,
  availableFromMinutes: Number,
  availableToHour: Number,
  availableToMinutes: Number,
  availableDays: [],
  experience: Number,
  docimage: [{ url: String, filename: String }],
  mobile: Number,
});

module.exports = doctorWorkitem;
