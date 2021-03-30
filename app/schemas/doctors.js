var mongoose = require('mongoose');

var doctors = new mongoose.Schema({
  name: String,
  password:String,
  email:String,
  department: String,
  age: Number,
  gender: String,
  availableFrom: Date,
  availableTo: Date,
  availableDays:[],
  experience: Number,
  docimage:[{url:String,filename:String}],
  mobile: Number

});

module.exports = doctors;
