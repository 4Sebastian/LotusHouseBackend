"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _issue = _interopRequireDefault(require("./models/issue"));

var _event = _interopRequireDefault(require("./models/event"));

var _room = _interopRequireDefault(require("./models/room"));

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

router.route('/:date/events').get(function (req, res) {
  _event["default"].find(function (err, events) {
    if (err) console.log(err);else res.json(events);
  });
});
router.route('/:date/rooms').get(function (req, res) {
  _room["default"].find(function (err, rooms) {
    if (err) console.log(err);else res.json(rooms);
  });
}); //Individual Indexes

router.route('/:date/events/:id').get(function (req, res) {
  _event["default"].findById(req.params.id, function (err, event) {
    if (err) console.log(err);else res.json(event);
  });
});
router.route('/:date/rooms/:id').get(function (req, res) {
  _room["default"].findById(req.params.id, function (err, room) {
    if (err) console.log(err);else res.json(room);
  });
}); //Add to each Array

router.route('/:date/events/add').post(function (req, res) {
  var event = new _event["default"](req.body);
  event.save().then(function (event) {
    res.status(200).json({
      'event': 'Added succesfully'
    });
  })["catch"](function (err) {
    res.status(400).send('Failed to create new record');
  });
});
router.route('/:date/rooms/add').post(function (req, res) {
  var room = new _room["default"](req.body);
  room.save().then(function (room) {
    res.status(200).json({
      'issue': 'Added succesfully'
    });
  })["catch"](function (err) {
    res.status(400).send('Failed to create new record');
  });
}); //Update Individual Indexes

router.route('/:date/events/update/:id').post(function (req, res) {
  _event["default"].findById(req.params.id, function (err, event) {
    if (!event) return next(new Error('Could not load document'));else {
      event.title = req.body.title;
      event.date = req.body.date;
      event.description = req.body.description;
      event.save().then(function (event) {
        res.json('Update done');
      })["catch"](function (err) {
        res.status(400).send('Update failed');
      });
    }
  });
});
router.route('/:date/rooms/update/:id').post(function (req, res) {
  _room["default"].findById(req.params.id, function (err, room) {
    if (!room) return next(new Error('Could not load document'));else {
      room.name = req.body.name;
      room.number = req.body.number;
      room.events = req.body.events;
      room.save().then(function (room) {
        res.json('Update done');
      })["catch"](function (err) {
        res.status(400).send('Update failed');
      });
    }
  });
}); //Delete Individual Indexes

router.route('/:date/events/delete/:id').get(function (req, res) {
  _event["default"].findByIdAndRemove({
    _id: req.params.id
  }, function (err, event) {
    if (err) res.json(err);else res.json('Remove successfully');
  });
});
router.route('/:date/rooms/delete/:id').get(function (req, res) {
  _room["default"].findByIdAndRemove({
    _id: req.params.id
  }, function (err, room) {
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