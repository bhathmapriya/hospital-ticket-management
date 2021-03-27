var mongoose = require('mongoose');
var express = require('express');
var router = express();

var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
const doctorDefinition = require('./schemas/doctorProfile.js');
const patrequire = require('./schemas/requirements');
const doctorregister = require('./schemas/doctorreg.js');

const doctoraccount = new mongoose.model('doctoraccount',doctorregister);

const doctorProfile = new mongoose.model(
  'doctorProfile',
  doctorDefinition,
  'doctorProfile'
);
const requires = new mongoose.model('requires', patrequire);

router.get('/doctor',function(req,res){

  console.log("doctorr signing up page");
  res.render('doctoesignup.ejs');

});

router.post('/doctor',upload.array('docimage'),async(req,res)=>{

    const name=req.body.name;
    const password=req.body.password;
    const email=req.body.email;
    const department=req.body.department;
    const docimage = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    const age=req.body.age;
    const availableFrom=req.body.availableFrom;
    const availableTo=req.body.availableTo;
    const experience=req.body.experience;
   // const docimage=req.body.docimage;
    const mobile=req.body.mobile;
     
    var doctorr={
        name: name,
        password: password,
        email:email,
        department:department,
        age:age,
        availableFrom:availableFrom,
        availableTo:availableTo,
        experience:experience,
        docimage:docimage,
        mobile:mobile
    };
 
    doctoraccount.create(doctorr,function(err){
        if(err){
            res.send(err);
        }
        else{
            res.redirect("/permission");
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
