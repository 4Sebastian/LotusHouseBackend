"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _event = _interopRequireDefault(require("./models/event"));

var _room = _interopRequireDefault(require("./models/room"));

var _mongoose = require("mongoose");

var app = (0, _express["default"])();

var router = _express["default"].Router();

app.use((0, _cors["default"])());
app.use(_bodyParser["default"].json());

require('dotenv').config();

var user = require('./controllers/userController'); //const MongoClient = require('mongodb').MongoClient;


var uri = "mongodb+srv://sebastian101:0229549sp@cluster0-fgh2k.mongodb.net/Cluster0?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); //'mongodb://localhost:27017/issues'

var connection = mongoose.connection;
connection.once('open', function () {
  console.log('MongoDB database connection established succesfully');
}); // const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
//Arrays

router.route('/events/:formDate').get(function (req, res) {
  _event["default"].find({
    formDate: req.params.formDate
  }, function (err, events) {
    if (err) console.log(err);else res.json(events);
  });
});
router.route('/rooms/:formDate').get(function (req, res) {
  _room["default"].find({
    formDate: req.params.formDate
  }, function (err, rooms) {
    if (err) console.log(err);else res.json(rooms);
  });
}); //Individual Indexes

router.route('/events/:formDate/:id').get(function (req, res) {
  _event["default"].find({
    formDate: req.params.formDate
  }, function (err, events) {
    var event = events.find({
      _id: req.params.id
    });
    if (err) console.log(err);else res.json(event);
  });
});
router.route('/rooms/:formDate/:id').get(function (req, res) {
  _room["default"].find({
    formDate: req.params.formDate
  }, function (err, rooms) {
    var room = rooms.find({
      _id: req.params.id
    });
    if (err) console.log(err);else res.json(room);
  });
}); //Add to each Array

router.route('/events/:formDate/add').post(function (req, res) {
  var event = new _event["default"](req.body);
  event.formDate = req.params.formDate;
  event.save().then(function (event) {
    res.status(200).json({
      'event': 'Added succesfully'
    });
  })["catch"](function (err) {
    res.status(400).send('Failed to create new record');
  });
});
router.route('/rooms/:formDate/add').post(function (req, res) {
  var room = new _room["default"](req.body);
  room.formDate = req.params.formDate;
  room.save().then(function (room) {
    res.status(200).json({
      'issue': 'Added succesfully'
    });
  })["catch"](function (err) {
    res.status(400).send('Failed to create new record');
  });
}); //Update Individual Indexes

router.route('/events/:formDate/update/:id').post(function (req, res) {
  _event["default"].find({
    formDate: req.params.formDate
  }, function (err, events) {
    var event = events.find({
      _id: req.params.id
    });
    if (!event) return next(new Error('Could not load document'));else {
      event.title = req.body.title;
      event.date = req.body.date;
      event.description = req.body.description;
      event.formDate = req.params.formDate;
      event.save().then(function (event) {
        res.json('Update done');
      })["catch"](function (err) {
        res.status(400).send('Update failed');
      });
    }
  });
});
router.route('/rooms/:formDate/update/:id').post(function (req, res) {
  _room["default"].find({
    formDate: req.params.formDate
  }, function (err, rooms) {
    var room = rooms.find({
      _id: req.params.id
    });
    if (!room) return next(new Error('Could not load document'));else {
      room.name = req.body.name;
      room.number = req.body.number;
      room.events = req.body.events;
      room.formDate = req.params.formDate;
      room.save().then(function (room) {
        res.json('Update done');
      })["catch"](function (err) {
        res.status(400).send('Update failed');
      });
    }
  });
}); //Delete Individual Indexes

router.route('/events/:formDate/delete/:id').get(function (req, res) {
  _event["default"].find({
    formDate: req.params.formDate
  }, function (err, events) {
    var event = events.find({
      _id: req.params.id
    });
    event.deleteOne();
    if (err) res.json(err);else res.json('Remove successfully');
  });
});
router.route('/rooms/:formDate/delete/:id').get(function (req, res) {
  _room["default"].find({
    formDate: req.params.formDate
  }, function (err, rooms) {
    var room = rooms.find({
      _id: req.params.id
    });
    room.deleteOne();
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