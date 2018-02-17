var auth = require("./auth");
var schema = require("./schema");
var sockets = [];
var io;

const GAME_ID_LENGTH = 8;
const GAME_ID_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

module.exports.games = [
    {
        name: "MafiaLibs",
        id: "mafialibs"
    },
    {
        name: "Chat Room",
        id: "chatroom"
    }

];

module.exports.setup = function (server) {
    io = server;
};

// join an existing game
module.exports.joinGame = function (gameID, res) {
    var query = {game_id: gameID};
    schema.Game.find(query).limit(1).count().exec(function (err, found) {
        if (found > 0) {
            res.json({
                status: "success",
                url: "../play/" + gameID
            })

        } else {
            res.json({
                status: "failed"
            })
        }
    });
};

// create a game
module.exports.createGame = function (gameType, res) {
    for (var i = 0; i < this.games.length; i++) {
        var game = this.games[i];
        if (game["name"] == gameType) {
            getGameID(1, function (id) {
                if (id) {
                    setupGame(id, game, function() {
                        module.exports.joinGame(id, res);
                    });
                } else {
                    res.json({
                        status: "failed",
                        url: "../error"
                    })
                }
            });
            break;
        }
    }
};

// redirects user to the game page
module.exports.startGame = function (url, res) {
    var match = url.match("/.+\\/(.+)$");
    schema.Game.findOne({game_id: match}, function (err, found) {
        if (found["status"] === "waiting") {
            switch (found["type"]) {
                case "chatroom":
                    res.sendFile("chat.html", {root: __dirname + "/../public/views"});
                    break;
                case "mafialibs":
                    res.sendFile("mafialibs.html", {root: __dirname + "/../public/views"});
                    break;
                default:
                    res.redirect("../dashboard")
            }
        } else {
            res.redirect("../dashboard")
        }
    });
};

// creates socket for game
function setupGame(id, game, cb) {
    schema.Game.create({
        game_id: id,
        type: game["id"]
    }, function (err) {
        if (err) {
            throw err;
        } else {
            sockets[id] = io.of('/' + id);
            console.log('created socket at /' + id);
            sockets[id].on('connection', function(socket) {
                console.log("socket connected");
                auth.getTokenInfo(socket.handshake.headers.cookie, function(data) {
                    schema.Game.findOneAndUpdate(
                        {game_id: id},
                        {$addToSet: {users: {user_id: data["id"], socket: socket.id}}}
                    ).exec();
                    socket.on('disconnect', function () {
                        console.log("socket disconnected");
                        schema.Game.findOneAndUpdate(
                            {game_id: id},
                            {$pull: {users: {user_id: data["id"], socket: socket.id}}}
                        ).exec();
                    });
                });
            });
            cb();
        }
    });
}

function getGameID(callNum, cb) {
    callNum++;
    if (callNum > 10) {
        cb(null);
        return;
    }
    var id = generateID();
    schema.Game.find({game_id: id}).limit(1).count().exec(function (err, res) {
        if (res == 0) {
            cb(id);
        } else {
            getGameID(callNum, cb);
        }
    });
}

function generateID() {
    var id = "";
    for (var i = 0; i < GAME_ID_LENGTH; i++) {
        id += GAME_ID_CHARS.charAt(Math.floor(Math.random() * GAME_ID_CHARS.length));
    }
    return id;
}