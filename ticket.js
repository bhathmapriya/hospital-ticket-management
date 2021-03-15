if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require('path');
var bcrypt = require('bcrypt');
var multer = require("multer");
var { storage } = require("./cloudinary");
var upload = multer({ storage });
var session = require("express-session");
var cors= require("cors");

mongoose.connect('mongodb://localhost:27017/trs', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'notagoodsecret', saveUninitialized: true, resave: true }));

app.set('view engine', 'ejs');



var trsschema = new mongoose.Schema({
    clientname: String,
    desc: String,
    images: [{ url: String, filename: String }],
    name: String,
    date: Date

});

var signupschema = new mongoose.Schema({
    username: {
        type: String,
        //unique: true,
        required: [true, 'Username cannot be blank'],
    },
    password: {
        type: String,
        required: [true, 'enter password']
    },
    mobilenumber: String,  
    address: String, 
    email: String,    
    imagee: [{ url: String, filename: String }],
});


var trss = new mongoose.model("trss", trsschema);
var register = new mongoose.model("register", signupschema);


app.get("/",function (req, res) {
    res.render('signup.ejs');
});

app.post("/", upload.array('imagee'),async (req, res)=> {

    var { password, username,imagee, mobilenumber, address,email } = req.body;
    imagee= req.files.map(f=>({ url: f.path, filename: f.filename}));
    var hash = await bcrypt.hash(password, 12);
    var user = new register({
        username,
        password: hash,
        mobilenumber,
        imagee,
        address,
        email
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect("/login");
    return user;
});

app.get("/login", function (req, res) {
   /* if (req.session?.user_id) {
        res.redirect("/ticketgen");
        return;
    }*/
    res.render("login");
});

app.post("/login", async (req, res) => {
    var { password, username,mobilenumber,imagee, address,email } = req.body;
    var user = await register.findOne({ username });
    console.log(user);
    
    var validuser = await bcrypt.compare(password, user.password);
    if (validuser) {
        req.session.user_id = user._id;
        res.redirect("/ticketgen/"+ user._id);
    }
    else {
        res.redirect("/login");
    }

});

app.get("/ticketgen/:id", async(req, res)=> {
    var id=req.params.id;
    console.log(id);
    //console.log(req.session);
    
    if (!req.session?.user_id) {
        res.redirect("/login");
        return;
    }
   else{
       var {username,password}=req.body;
      // var userr= await register.findOne(req.session.user_id);
      // console.log(userr.password);
     // var name=userr.username;
      //console.log(userr);
      register.find({"_id":id },function(err,doc){

        if(err){
            console.log(err);
        }
        else{
            console.log(doc);
            res.render("tick.ejs",{doc:doc});
        }
      });
      
   }
    /*register.find({id:req.params.id,},async(err,docs)=>{
        console.log(id);
       
       var data=await register.findOne({id});
       console.log(data);*/
       //var ret= where(data.user,{id:req.params.id});
       //res.json(ret);
       /* if(err){
            console.log(err);
        }
        else{
            res.render("tick.ejs",{docs:docs});
        }*/
    
  

   
 //   res.render("tick.ejs");
    
});

app.get("/profile/:id",function(req,res){
    var id=req.params.id;
    register.find({"_id": id},function(err,data){
        if(err){
            console.log(err);
        }
        else{
            res.render("profile",{data:data});
        }
    });
});



app.get("/display", function (req, res) {
   
    if (!req.session?.user_id) {
        res.redirect("/login");
    }

    trss.find({}, function (err, ans) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("displaytickets.ejs", { arr: ans });
        }
    });

});


app.post("/display", upload.array('image'), function (req, res, next) {
    // res.send(req.body,req.file);
    var newticket = {
        clientname: req.body.clientname,
        desc: req.body.desc,
        name: req.body.name,
        images: req.files.map(f => ({ url: f.path, filename: f.filename })),
        time: req.body.date
    }
   
    trss.create(newticket, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/display");
        }
    });
});

async function validateSession(username, password) {
    var user = await register.findOne({ username });
    return await bcrypt.compare(password, user.password);
}

app.listen("3000", function (req, res) {
    console.log("process started");
});