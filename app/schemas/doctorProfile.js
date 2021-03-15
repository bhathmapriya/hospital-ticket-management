var mongoose = require('mongoose');

const definition = new mongoose.Schema({
  name: {
    type: String,
    //unique: true,
    required: [true, 'Doctor name cannot be blank'],
  },
  department: {
    type: String,
  },
  age: Number,
  availability: Boolean,
  availableTime: String,
  reviews: {
    type: String,
    star: Number,
  },
});

module.exports = definition;
