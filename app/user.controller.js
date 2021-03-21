var mongoose = require('mongoose');
var express = require('express');
var router = express();

var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
var bcrypt = require('bcrypt');
var session = require('express-session');
const userSchema = require('./schemas/user');

var register = new mongoose.model('register', userSchema);
router.use(express.static(__dirname +'/public'));

router.post('/', upload.array('imagee'), async (req, res) => {
  var { password, username, imagee, mobilenumber, address, email } = req.body;
  imagee = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  var hash = await bcrypt.hash(password, 12);
  var user = new register({
    username,
    password: hash,
    mobilenumber,
    imagee,
    address,
    email,
  });
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/login');
  return user;
});

router.post('/login', async (req, res) => {
  var { password, username, mobilenumber, imagee, address, email } = req.body;
  var user = await register.findOne({ username });
  console.log(user);

  var validuser = await bcrypt.compare(password, user.password);
  if (validuser) {
    req.session.user_id = user._id;
    res.redirect('/ticketgen/' + user._id);
  } else {
    res.redirect('/login');
  }
});

router.get('/ticketgen/:id', async (req, res) => {
  var id = req.params.id;
  console.log(id);
  //console.log(req.session);

  if (!req.session?.user_id) {
    res.redirect('/login');
    return;
  } else {
    var { username, password } = req.body;
    // var userr= await user.findOne(req.session.user_id);
    // console.log(userr.password);
    // var name=userr.username;
    //console.log(userr);
    register.find({ _id: id }, function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log(doc);
        res.render('tick.ejs', { doc: doc });
      }
    });
  }
  /*user.find({id:req.params.id,},async(err,docs)=>{
        console.log(id);

       var data=await user.findOne({id});
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

router.get('/profile/:id', function (req, res) {
  var id = req.params.id;
  register.find({ _id: id }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render('profile', { data: data });
    }
  });
});

router.get('/login', function (req, res) {
  /* if (req.session?.user_id) {
         res.redirect("/ticketgen");
         return;
     }*/
  res.render('login');
});

router.get('/', function (req, res) {
  res.redirect('/login');
});

router.get('/signup', function (req, res) {
  res.render('signup.ejs');
});

async function validateSession(username, password) {
  var user = await user.findOne({ username });
  return await bcrypt.compare(password, user.password);
}

module.exports = router;
