var mongoose = require('mongoose');

const definition = new mongoose.Schema({
  username: {
    type: String,
    //unique: true,
    required: [true, 'Username cannot be blank'],
  },
  password: {
    type: String,
    required: [true, 'enter password'],
  },
  mobilenumber: String,
  address: String,
  email: String,
  imagee: [{ url: String, filename: String }],
});

module.exports = definition;
