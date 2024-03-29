import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Room = new Schema({
    name: {
        type: String
    },
    number: {
        type: String
    }, 
    events: {
        type: [String]
    }
});

export default mongoose.model('Room', Room);