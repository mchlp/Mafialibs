var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    game_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "waiting"
    },
    type: {
        type: String,
        required: true
    },
    created: {
        type: Date,
    },
    user_count: {
        type: Number,
        default: 0
    },
    users_secret: {
        type: Array,
        default: []
    },
    users_public: {
        type: Array,
        default: []
    },
    open: {
        type: Boolean,
        default: true
    },
    game_data: {
        type: Schema.Types.Mixed,
    }
});

var userSchema = new Schema({
    user_id: {
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
        type: Date,
    },
    created: {
        type: Date,
    },
    game_count: {
        type: Number,
        default: 0
    }
});

module.exports.User = mongoose.model("User", userSchema);
module.exports.Game = mongoose.model("Game", gameSchema);