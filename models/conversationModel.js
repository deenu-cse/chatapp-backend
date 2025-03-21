const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    messages: [{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
            maxlength: 500,
            validate: {
                validator: (value) => value.trim().length > 0,
                message: 'Message cannot be empty.'
            },
        },
        timestamp: {
            type: Date,
            default: Date.now,
        }
    }],
}, { timestamps: true });

const Conversation = mongoose.model('conversation', conversationSchema);
module.exports = Conversation;