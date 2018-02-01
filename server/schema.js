var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    source: {
        type: String,
        enum: ["google", "local"]
    },
    rank: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
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
    username: {
        type: String
    },
    displayName: {
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
        default: new Date().toISOString()
    },
    created: {
        type: String,
        default: new Date().toISOString()
    },
    gameCount: {
        type: Number,
        default: 0
    }
});

module.exports.User = mongoose.model("User", userSchema);