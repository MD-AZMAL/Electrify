const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    userId: String,
    points: Number,
    cash: Number,
    chain: [{
        index: Number,
        prevhash: String,
        hash: String,
        nonce: Number,
        data: {
            senderKey: String,
            recieverKey: String,
            power: Number,
            money: Number
        }
    }]
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);