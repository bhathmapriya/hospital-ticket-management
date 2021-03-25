var mongoose = require('mongoose');
var express = require('express');
var router = express();

var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
const doctorDefinition = require('./schemas/doctorProfile.js');
const patrequire=require('./schemas/requirements');
const doctorProfile = new mongoose.model(
  'doctorProfile',
  doctorDefinition,
  'doctorProfile'
);
const requires=new mongoose.model('requires',patrequire);

router.get('/doctors/:id',function(req,res){
   id=req.params.id;
   console.log(id);
   patrequires.find({_id:id},function(err,data){
    if(err){
      res.send(err);
    }
    else{
      res.redirect('doctors.ejs',{data:data});
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
