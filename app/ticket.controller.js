var mongoose = require('mongoose');
var express = require('express');
var router = express();
var moment = require('moment');
var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
const userSchema = require('./schemas/user');
const doctorDefinition = require('./schemas/doctors.js');
//const patientinfo = require('./schemas/user');
const patreq = require('./schemas/requirements');

const doctorsModal = new mongoose.model('doctors', doctorDefinition, 'doctors');
var register = new mongoose.model('register', userSchema);
//const patientinfoo = new mongoose.model('patientinfoo', patientinfo,'patientinfoo');
//console.log("information from PATIENT INFOOOO:::::");
//console.log(patientinfoo);
const patrequire = new mongoose.model('patrequire', patreq);

router.get('/searchDoctors', function (req, res, next) {
  const filter = {
    department: req.query.department,
    availableDays: {
      $in: [new Date(req.query.date).getDay().toString()],
    },
    availableFromHour: { $gte: parseInt(req.query.time.split(':')[0]) },
    availableToHour: { $gte: parseInt(req.query.time.split(':')[0]) },
  };
  console.log(filter);
  doctorsModal.find(filter, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    data = data.filter(
      (doc) =>
        doc.availableFromMinutes >= parseInt(req.query.time.split(':')[1])
    );
    res.json(data);
  });
});

router.get('/newtick/:id', async (req, res) => {
  var id = req.params.id;
  console.log(id);
  //var patient=await patientinfoo.findOne({username});

  //console.log(patient);
  register.find({ _id: id }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render('newtick', { _id: id });
    }
  });
});

router.post('/newtick/:id', async (req, res) => {
  var symptoms = req.body.symptoms;
  var date = req.body.date;
  var department = req.body.department;
  var time = req.body.time;
  var id = req.params.id;
  //console.log('check check check');
  console.log(req.body);
  const timee = time.split(':');
  //console.log(timee);
  const momentObj = moment(date); //creating a moment obj for demo
  momentObj.set({ hours: timee[0], minutes: timee[1] });
  //console.log(momentObj.format("DD/MM/YYYY hh:mm a"));
  console.log(momentObj.toDate());
  var requirements = new patrequire({
    symptoms: symptoms,
    department: department,
    date: momentObj.toDate(),
    time: time,
    patientId: id,
    status: 'Awaiting',
    statusMessage: 'Awaiting for doctors response',
    doctorId: req.body.doctorId,
  });
  await requirements.save();
  res.redirect('/doctors/' + id);
  //return requirements;

  ////////////////////////////////////////////
  /*to pop up list of doctors as per prefernce*/
  /////////////////////////////////////////
  /* res.redirect('/listofdoctors',{data:data});
    }
  });*/
});

router.get('/existing/:id', function (req, res) {
  var id = req.params.id;
  console.log('check existing profile');
  console.log(id);
  patrequire.find({ patientId: id }, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      console.log(data);
      res.render('raisedtickets.ejs', { data: data });
    }
  });
});

router.get('/display', function (req, res) {
  if (!req.session?.user_id) {
    res.redirect('/login');
  }

  patientinfoo.find({}, function (err, ans) {
    if (err) {
      console.log(err);
    } else {
      res.render('displaytickets.ejs', { arr: ans });
    }
  });
});

router.post('/display', upload.array('image'), function (req, res, next) {
  // res.send(req.body,req.file);
  var newticket = {
    clientname: req.body.clientname,
    desc: req.body.desc,
    name: req.body.name,
    images: req.files.map((f) => ({ url: f.path, filename: f.filename })),
    time: req.body.date,
  };

  tickets.create(newticket, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/display');
    }
  });
});

module.exports = router;
