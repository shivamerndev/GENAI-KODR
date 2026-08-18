import { Schema, model } from 'mongoose';

const MessageSchema = new Schema({

    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'ai'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    fileName: {
        type: String
    },
    fileId: {
        type: String
    }
    
}, { timestamps: true });

export default model('Message', MessageSchema);