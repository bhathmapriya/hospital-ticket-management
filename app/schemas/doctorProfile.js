var mongoose = require('mongoose');

var definition = new mongoose.Schema({
  name: String,
  department: String,
  age: Number,
  availability: Boolean,
  availableFrom: String,
  availableTo: String,
  reviews: String,
});

module.exports = definition;
