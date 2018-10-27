const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    userId: String,
    points: Number,
    cash: Number
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);