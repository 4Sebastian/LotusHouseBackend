import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Event = new Schema({
    formDate:{
        type: String
    },
    title: {
        type: String
    },
    date: {
        type: String
    },
    description: {
        type: String
    }
});

export default mongoose.model('Event', Event);