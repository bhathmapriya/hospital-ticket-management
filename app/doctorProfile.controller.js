var mongoose = require('mongoose');
var express = require('express');
var router = express();

var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
const ticketDefinition = require('./schemas/doctorProfile.js');

const doctorProfiles = new mongoose.model('doctorProfile', ticketDefinition);

router.get('/list', function (req, res) {
  doctorProfiles.find({},(err, data)=>{
      if(err){
          console.error(err)
      }
      res.render(,{list:data})
  })
});

