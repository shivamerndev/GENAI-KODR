import { Schema, model } from 'mongoose';

const UserSchema = new Schema({

    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    picture:{
        type:String,
        required:true,
    }

});

export default model('User', UserSchema);