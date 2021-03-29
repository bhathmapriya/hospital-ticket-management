var mongoose = require('mongoose');
var express = require('express');
var router = express();

var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });

const doctorregister = require('./schemas/doctorreg.js');
console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
const doctoraccount = new mongoose.model('doctoraccount',doctorregister);

router.get('/doctor',function(req,res){

    console.log("doctorr signing up page");
    res.render('doctoesignup.ejs');

});

router.post('/doctor',async(req,res)=>{

    const name=req.body.name;
    const password=req.body.password;
    const email=req.body.email;
    const department=req.body.department;
    const age=req.body.age;
    const availableFrom=req.body.availableFrom;
    const availableTo=req.body.availableTo;
    const experience=req.body.experience;
    const docimage=req.body.docimage;
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

module.exports=router;