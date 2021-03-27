var mongoose = require('mongoose');

var doctordetails = new mongoose.Schema({
  name: String,
  password:String,
  email:String,
  department: String,
  age: Number,
  gender: String,
  availableFrom: String,
  availableTo: String,
  experience: Number,
  docimage:[{url:String,filename:String}],
  mobile: Number

});

module.exports = doctordetails;
