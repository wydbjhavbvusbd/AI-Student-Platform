const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

    user: String,

    msg: String,

    img: String,

    receiver: String,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
    mongoose.model('Message', MessageSchema);