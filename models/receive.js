const mongoose = require('mongoose');

var ReceiverSchema = new mongoose.Schema({
    receivername: String,
    receiverId: String,
    requirement: Number
});

module.exports = mongoose.model('Receivers', ReceiverSchema);