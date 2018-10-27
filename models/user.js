const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
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

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);