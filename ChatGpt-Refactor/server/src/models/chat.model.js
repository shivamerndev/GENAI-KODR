import { Schema, model } from 'mongoose';

const ChatSchema = new Schema({

    title:{
        type: String,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

}, { timestamps: true });

export default model('Chat', ChatSchema);