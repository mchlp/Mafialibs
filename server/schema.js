var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    fullName: {
        type: String
    },
    emailVerified: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    picURL: {
        type: String,
        required: true
    },
    lastLogin: {
        type: String,
        default: Date.now().toString()
    },
    created: {
        type: String,
        default: Date.now().toString()
    },
    gameCount: {
        type: Number,
        default: 0
    }
});

module.exports.User = mongoose.model("User", userSchema);