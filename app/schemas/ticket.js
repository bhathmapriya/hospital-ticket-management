var mongoose = require('mongoose');

const definition = new mongoose.Schema({
  clientname: String,
  desc: String,
  images: [{ url: String, filename: String }],
  name: String,
  date: Date,
});

module.exports = definition;
