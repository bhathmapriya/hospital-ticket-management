if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var multer = require('multer');
var { storage } = require('./cloudinary');
var upload = multer({ storage });
var session = require('express-session');

const ticketController = require('./app/ticket.controller');
const userController = require('./app/user.controller');
const doctorProfileController = require('./app/doctorProfile.controller');

mongoose.connect('mongodb://localhost:27017/trs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static('/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({ secret: 'notagoodsecret', saveUninitialized: true, resave: true })
);

app.set('view engine', 'ejs');

app.use('', ticketController);
app.use('', userController);
app.use('/doctor', doctorProfileController);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen('3000', function (req, res) {
  console.log('process started');
});
