"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _event = _interopRequireDefault(require("./models/event"));

var _room = _interopRequireDefault(require("./models/room"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var app = (0, _express["default"])();

var router = _express["default"].Router();

app.use((0, _cors["default"])());
app.use(_bodyParser["default"].json());

require('dotenv').config();

var user = require('./controllers/userController'); //const MongoClient = require('mongodb').MongoClient;


var uri = "mongodb+srv://sebastian101:0229549sp@cluster0-fgh2k.mongodb.net/Cluster0?retryWrites=true&w=majority";

_mongoose["default"].connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); //'mongodb://localhost:27017/issues'


var connection = _mongoose["default"].connection;
connection.once('open', function () {
  console.log('MongoDB database connection established succesfully');
}); // const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
//Arrays

router.route('/events/:shelterName/:formDate').get(function (req, res) {
  _event["default"].find({
    formDate: req.params.formDate,
    shelterName: req.params.shelterName
  }, function (err, events) {
    if (err) console.log(err);else res.json(events);
  });
});
router.route('/rooms/:shelterName/:formDate').get(function (req, res) {
  _room["default"].find({
    formDate: req.params.formDate,
    shelterName: req.params.shelterName
  }, function (err, rooms) {
    if (err) console.log(err);else res.json(rooms);
  });
}); //Individual Indexes

router.route('/events/:shelterName/:formDate/:id').get(function (req, res) {
  _event["default"].find({
    formDate: req.params.formDate,
    _id: req.params.id,
    shelterName: req.params.shelterName
  }, function (err, events) {
    if (err) console.log(err);else res.json(events);
  });
});
router.route('/rooms/:shelterName/:formDate/:id').get(function (req, res) {
  _room["default"].find({
    formDate: req.params.formDate,
    _id: req.params.id,
    shelterName: req.params.shelterName
  }, function (err, rooms) {
    if (err) console.log(err);else res.json(rooms);
  });
}); //Add to each Array

router.route('/events/:shelterName/:formDate/add').post(function (req, res) {
  var event = new _event["default"](req.body);
  event.formDate = req.params.formDate;
  event.shelterName = req.params.shelterName;
  event.save().then(function (event) {
    res.status(200).json({
      'event': 'Added succesfully'
    });
  })["catch"](function (err) {
    res.status(400).send('Failed to create new record');
  });
});
router.route('/rooms/:shelterName/:formDate/add').post(function (req, res) {
  var room = new _room["default"](req.body);
  room.formDate = req.params.formDate;
  room.shelterName = req.params.shelterName;
  room.save().then(function (room) {
    res.status(200).json({
      'issue': 'Added succesfully'
    });
  })["catch"](function (err) {
    res.status(400).send('Failed to create new record');
  });
}); //Update Individual Indexes

router.route('/events/:shelterName/:formDate/update/:id').post(function (req, res) {
  _event["default"].find({
    formDate: req.params.formDate,
    _id: req.params.id,
    shelterName: req.params.shelterName
  }, function (err, events) {
    if (!events[0]) return next(new Error('Could not load document'));else {
      events[0].title = req.body.title;
      events[0].date = req.body.date;
      events[0].description = req.body.description;
      events[0].formDate = req.params.formDate;
      events[0].shelterName = req.params.shelterName;
      events[0].save().then(function (event) {
        res.json('Update done');
      })["catch"](function (err) {
        res.status(400).send('Update failed');
      });
    }
  });
});
router.route('/rooms/:shelterName/:formDate/update/:id').post(function (req, res) {
  _room["default"].find({
    formDate: req.params.formDate,
    _id: req.params.id,
    shelterName: req.params.shelterName
  }, function (err, rooms) {
    if (!rooms[0]) return next(new Error('Could not load document'));else {
      rooms[0].name = req.body.name;
      rooms[0].number = req.body.number;
      rooms[0].events = req.body.events;
      rooms[0].formDate = req.params.formDate;
      rooms[0].shelterName = req.params.shelterName;
      rooms[0].save().then(function (room) {
        res.json('Update done');
      })["catch"](function (err) {
        res.status(400).send('Update failed');
      });
    }
  });
}); //Delete Individual Indexes

router.route('/events/:shelterName/:formDate/delete/:id').get(function (req, res) {
  _event["default"].find({
    formDate: req.params.formDate,
    _id: req.params.id,
    shelterName: req.params.shelterName
  }, function (err, events) {
    events[0].deleteOne();
    if (err) res.json(err);else res.json('Remove successfully');
  });
});
router.route('/rooms/:shelterName/:formDate/delete/:id').get(function (req, res) {
  _room["default"].find({
    formDate: req.params.formDate,
    _id: req.params.id,
    shelterName: req.params.shelterName
  }, function (err, rooms) {
    rooms[0].deleteOne();
    if (err) res.json(err);else res.json('Remove successfully');
  });
}); //Use and Listen

app.use('/', router);
app.use('/user', user);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.listen(process.env.PORT || 3000, function () {
  return console.log('Express server running on port listening on ${{PORT}}');
});