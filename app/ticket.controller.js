var mongoose = require('mongoose');
var express = require('express');
var router = express();

var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
const ticketDefinition = require('./schemas/ticket.js');

const tickets = new mongoose.model('tickets', ticketDefinition);

router.get('/display', function (req, res) {
  if (!req.session?.user_id) {
    res.redirect('/login');
  }

  tickets.find({}, function (err, ans) {
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
