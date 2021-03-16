var mongoose = require('mongoose');
var express = require('express');
var router = express();

var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
const doctorDefinition = require('./schemas/doctorProfile.js');

const doctorProfile = new mongoose.model(
  'doctorprofile',
  doctorDefinition,
  'doctorprofile'
);

router.get('/list', function (req, res) {
  doctorProfile.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      // var doc = JSON.stringify(data);
      // console.log(doc);
      data = data.map((item) => {
        const obj = {
          name: item.name,
          department: item.department,
          age: item.age,
          availability: item.availability,
          availableFrom: item.availableFrom,
          availableTo: item.availableTo,
          reviews: new Array(...JSON.parse(item.reviews)),
        };
        return obj;
      });
      // console.log(data);
      res.render('doctorList.ejs', { list: data });
    }
  });
});

module.exports = router;
