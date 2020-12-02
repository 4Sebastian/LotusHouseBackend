import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Event = new Schema({
    title: {
        type: String
    },
    date: {
        type: String
    },
    description: {
        type: String
    },
    shelterName: {
        type: String
    },
    formDate: {
        type: String
    }
});

export default mongoose.model('Event', Event);