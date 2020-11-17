import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let User = new Schema({
    userName: {
        type: String
    },
    hashedPassword: {
        type: String
    }, 
    email: {
        type: String
    },
    shelterName: {
        type: String
    },
    passwordResetToken: {
        type: String
    }
});

export default mongoose.model('User', User);