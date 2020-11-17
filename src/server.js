import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import Event from './models/event';
import Room from './models/room';
import mongoose from 'mongoose';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());


require('dotenv').config();
const user = require('./controllers/userController');
//const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://sebastian101:0229549sp@cluster0-fgh2k.mongodb.net/Cluster0?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
//'mongodb://localhost:27017/issues'

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established succesfully');
});

// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });




//Arrays
router.route('/events/:shelterName/:formDate').get((req, res) => {
    Event.find({ formDate: req.params.formDate, shelterName: req.params.shelterName }, (err, events) => {
        if (err)
            console.log(err);
        else
            res.json(events);
    });
});

router.route('/rooms/:shelterName/:formDate').get((req, res) => {
    Room.find({ formDate: req.params.formDate, shelterName: req.params.shelterName }, (err, rooms) => {
        if (err)
            console.log(err);
        else
            res.json(rooms);
    });
});


//Individual Indexes
router.route('/events/:shelterName/:formDate/:id').get((req, res) => {
    Event.find({ formDate: req.params.formDate, _id: req.params.id, shelterName: req.params.shelterName }, (err, events) => {
        if (err)
            console.log(err);
        else
            res.json(events);
    });
});

router.route('/rooms/:shelterName/:formDate/:id').get((req, res) => {
    Room.find({ formDate: req.params.formDate, _id: req.params.id, shelterName: req.params.shelterName }, (err, rooms) => {
        if (err)
            console.log(err);
        else
            res.json(rooms);
    });
});


//Add to each Array
router.route('/events/:shelterName/:formDate/add').post((req, res) => {
    let event = new Event(req.body);
    event.formDate = req.params.formDate;
    event.shelterName = req.params.shelterName;
    event.save()
        .then(event => {
            res.status(200).json({ 'event': 'Added succesfully' });
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/rooms/:shelterName/:formDate/add').post((req, res) => {
    let room = new Room(req.body);
    room.formDate = req.params.formDate;
    room.shelterName = req.params.shelterName;
    room.save()
        .then(room => {
            res.status(200).json({ 'issue': 'Added succesfully' });
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});


//Update Individual Indexes
router.route('/events/:shelterName/:formDate/update/:id').post((req, res) => {
    Event.find({ formDate: req.params.formDate, _id: req.params.id, shelterName: req.params.shelterName }, (err, events) => {
        if (!events[0])
            return next(new Error('Could not load document'));
        else {
            events[0].title = req.body.title;
            events[0].date = req.body.date;
            events[0].description = req.body.description;
            events[0].formDate = req.params.formDate;
            events[0].shelterName = req.params.shelterName;

            events[0].save().then(event => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }

    });
});

router.route('/rooms/:shelterName/:formDate/update/:id').post((req, res) => {
    Room.find({ formDate: req.params.formDate, _id: req.params.id, shelterName: req.params.shelterName }, (err, rooms) => {
        if (!rooms[0])
            return next(new Error('Could not load document'));
        else {
            rooms[0].name = req.body.name;
            rooms[0].number = req.body.number;
            rooms[0].events = req.body.events;
            rooms[0].formDate = req.params.formDate;
            rooms[0].shelterName = req.params.shelterName;

            rooms[0].save().then(room => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});


//Delete Individual Indexes
router.route('/events/:shelterName/:formDate/delete/:id').get((req, res) => {
    Event.find({ formDate: req.params.formDate, _id: req.params.id, shelterName: req.params.shelterName }, (err, events) => {
        events[0].deleteOne();
        if (err)
            res.json(err);
        else
            res.json('Remove successfully');
    });
});

router.route('/rooms/:shelterName/:formDate/delete/:id').get((req, res) => {
    Room.find({ formDate: req.params.formDate, _id: req.params.id, shelterName: req.params.shelterName }, (err, rooms) => {
        rooms[0].deleteOne();
        if (err)
            res.json(err);
        else
            res.json('Remove successfully');
    });
});




//Use and Listen
app.use('/', router);

app.use('/user', user);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});



app.listen(process.env.PORT || 3000, () => console.log('Express server running on port listening on ${{PORT}}'));