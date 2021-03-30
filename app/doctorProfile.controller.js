var mongoose = require('mongoose');
var express = require('express');
var router = express();

var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
const doctorDefinition = require('./schemas/doctorProfile.js');
//approved doctors
const doctorsSchema = require('./schemas/doctors.js');
const patrequire = require('./schemas/requirements');
//to get approval
const doctorWorkitemSchema = require('./schemas/doctor.workitem.js');

const doctors = new mongoose.model('doctors', doctorsSchema,'doctors');
const doctorWorkitem  = new mongoose.model('doctorWorkitem', doctorWorkitemSchema,'doctor.workitems');
const doctorProfile = new mongoose.model(
  'doctorProfile',
  doctorDefinition,
  'doctorProfile'
);
const requires = new mongoose.model('requires', patrequire);

router.get('/doctor', function (req, res) {

  console.log("doctorr signing up page");
  res.render('doctoesignup.ejs');

});

router.post('/doctor', upload.array('docimage'), async (req, res) => {

  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const department = req.body.department;
  const docimage = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  const age = req.body.age;
  let availableFrom = new Date();
  let availableTo = new Date();

  availableFrom.setHours(req.body.availableFrom.split(':')[0]);
  availableFrom.setMinutes(req.body.availableFrom.split(':')[1]);
  availableTo.setHours(req.body.availableTo.split(':')[0]);
  availableTo.setMinutes(req.body.availableTo.split(':')[1]);
  const experience = req.body.experience;
  // const docimage=req.body.docimage;
  const mobile = req.body.mobile;

  var doctorr = {
    name: name,
    password: password,
    email: email,
    department: department,
    age: age,
    availableFrom: availableFrom,
    availableTo: availableTo,
    availableDays:req.body.availableDays.split(','),
    experience: experience,
    docimage: docimage,
    mobile: mobile
  };

  doctorWorkitem.create(doctorr, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      //res.redirect should goes to doctor own profile
      //push adminprofile after admin login
      res.send('okay');
      // res.redirect('/adminprofile');
    }
  });

});

router.get('/adminprofile', function (req, res) {

  doctorWorkitem.find({}, function (err, permission) {

    if (err) {
      res.send(err);
    } else {
      res.render('adminprofile.ejs', { permission: permission });
    }
  });

});

router.get('/approve/:id', function (req, res) {
  var id = req.params.id;
  console.log("allow"+id);
  doctorWorkitem.findOne({ _id: id }, function (err, approved) {
    console.log(approved)
    if (err) {
      res.send(err);
    }
    else {
      var select = {
        name: approved.name,
        password: approved.password,
        email: approved.email,
        department: approved.department,
        age: approved.age,
        availableFrom: approved.availableFrom,
        availableTo: approved.availableTo,
        availableDays:approved.availableDays,
        experience: approved.experience,
        docimage: approved.docimage,
        mobile: approved.mobile
      }
      console.log(approved.mobile);
      doctors.create(select, function (err) {
        if (err) {
          res.send(err);
        }
        else {
          console.log("Doctor profile approved");
          doctorWorkitem.remove({_id:id},function(err,data){
            if(err){
              res.send(err);
              return;
            }
            res.json({ done: true });
        console.log("Profile rejected");
          });
        }
      });
    }
  });
});

router.get('/reject/:id', function (req, res) {
  var id = req.params.id;
  doctorWorkitem.find({ _id: id }, function (err, datas) {

    if (err) {
      res.send(err);
    }
    else {
      doctorWorkitem.remove({ _id: id }, function (err, data) {
        if (err) {
          res.send(err);
          return;
        }
        res.json({ done: true });
        console.log("Profile rejected");
      });

    }
  });
});

router.get('/doctors/:id', function (req, res) {
  id = req.params.id;
  console.log(id);
  requires.find({ _id: id }, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.render('doctors.ejs', { data: data });
    }
  });
});

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
      console.log(data);

      res.render('doctorList.ejs', { list: data });
    }
  });
});

module.exports = router;
