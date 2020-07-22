import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Issue from './models/issue';
import Event from './models/event';
import Room from './models/room';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());


require('dotenv').config();
const user = require('./controllers/userController');
//const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://sebastian101:0229549sp@cluster0-fgh2k.mongodb.net/Cluster0?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, });
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
router.route('/events/:date').get((req, res) => {
    Event.find((err, events) => {
        if (err)
            console.log(err);
        else  
            res.json(events);
    });
});

router.route ('/rooms/:date').get((req, res) => {
    Room.find((err, rooms) => {
        if (err)
            console.log(err);
        else
            res.json(rooms);
    });
});


//Individual Indexes
router.route('/events/:date/:id').get((req, res) => {
    Event.findById(req.params.id, (err, event) =>{
        if (err)
            console.log(err);
        else
            res.json(event);
    });
});

router.route('/rooms/:date/:id').get((req, res) => {
    Room.findById(req.params.id, (err, room) =>{
        if (err)
            console.log(err);
        else
            res.json(room);
    });
});


//Add to each Array
router.route('/events/:date/add').post((req, res) => {
    let event = new Event(req.body);
    event.save()
        .then(event => {
            res.status(200).json({ 'event': 'Added succesfully' });
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/rooms/:date/add').post((req, res) => {
    let room = new Room(req.body);
    room.save()
        .then(room => {
            res.status(200).json({ 'issue': 'Added succesfully' });
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});


//Update Individual Indexes
router.route('/events/:date/update/:id').post((req, res) => {
    Event.findById(req.params.id, (err, event) => {
        if (!event)
            return next(new Error('Could not load document'));
        else {
            event.title = req.body.title;
            event.date = req.body.date;
            event.description = req.body.description;

            event.save().then(event => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/rooms/:date/update/:id').post((req, res) => {
    Room.findById(req.params.id, (err, room) => {
        if (!room)
            return next(new Error('Could not load document'));
        else {
            room.name = req.body.name;
            room.number = req.body.number;
            room.events = req.body.events;

            room.save().then(room => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});


//Delete Individual Indexes
router.route('/events/:date/delete/:id').get((req, res) => {
    Event.findByIdAndRemove({ _id: req.params.id }, (err, event) => {
        if (err)
            res.json(err);
        else
            res.json('Remove successfully');
    });
});

router.route('/rooms/:date/delete/:id').get((req, res) => {
    Room.findByIdAndRemove({ _id: req.params.id }, (err, room) => {
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