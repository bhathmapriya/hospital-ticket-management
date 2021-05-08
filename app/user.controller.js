var mongoose = require('mongoose');
var express = require('express');
var router = express();
var path = require('path');
const methodOverride = require('method-override');

var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
var bcrypt = require('bcrypt');
var session = require('express-session');
const userSchema = require('./schemas/user');

var register = new mongoose.model('register', userSchema);
router.use(express.static('public'));
router.use(methodOverride('_method'));

router.get('/HTMS', function (req, res) {
  res.render('doc_or_pat.ejs');
});

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
  var { password, username } = req.body;
  var user = await register.findOne({ username });
  console.log(user);

  if (!user?.password) {
    // password empty redirect to login page
    res.render('login.ejs', { error: 'Incorrect username or password.' });
    return;
  }
  var validuser = await bcrypt.compare(password, user?.password);
  if (!validuser) {
    // password doesn't match redirect to login page
    res.render('login.ejs', { error: 'Incorrect username or password.' });
    return;
  }
  req.session.user_id = user._id;
  res.redirect('/ticketgen/' + user._id);
});

router.get('/ticketgen/:id', function (req, res) {
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

router.get('/edit/:id', async (req, res) => {
  var id = req.params.id;
  register.find({ _id: id }, function (err, datas) {
    if (err) {
      console.log(err);
    } else {
      console.log('DATA BEFORE EDIT');
      console.log(datas);
      res.render('edit', { datas: datas });
    }
  });
});

router.put('/profile/:id', async (req, res) => {
  // res.send("IT WORKED");

  const { id } = req.params;
  //const {idd}=id;
  register.findByIdAndUpdate(
    id,
    {
      username: req.body.username,
      address: req.body.address,
      mobilenumber: req.body.mobilenumber,
    },
    { new: true },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log('Updated user:', docs);
        res.redirect('/profile/' + req.params.id);
      }
    }
  );
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
