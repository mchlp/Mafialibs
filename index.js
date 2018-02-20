const DB_USERNAME = "mafialibs-user";
const DB_PASSWORD = "mafialibs123";
const DB_ADDRESS = "127.0.0.1";
const DB_PORT = "27017";
const DB_DATABASE = "mafialibs-db";
const CLIENT_ID = "61123325910-bqfncmh15jgfg2o1millsnbd9k3floku.apps.googleusercontent.com";
const BASE_URLS = [
    "https://mchlp.tk/mafialibs/",
    "http://mchlp.tk/mafialibs/",
    "http://localhost:3000/"
];

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io")(server);
//var http = require('http').Server(app);
var path = require('path');
var session = require('cookie-session');
var fs = require('fs');
var format = require('util').format;
var bodyParser = require('body-parser');
var googleAuth = new require('google-auth-library');
var client = new googleAuth.OAuth2Client(CLIENT_ID, '', '');
var cookieParser = require('cookie-parser');
var auth = require("./server/auth");
var schema = require("./server/schema");
var settings = require("./server/settings");
var users = require("./server/users");

var games = require("./server/games");
games.setup(io);

var mongoose = require('mongoose');
var url = format("mongodb://%s:%s@%s:%s/%s", DB_USERNAME, DB_PASSWORD, DB_ADDRESS, DB_PORT, DB_DATABASE);
var hbsHandler = require('./server/hbsHelper');
hbsHandler.compileTemplates();

// check if dev mode is enabled
fs.open("devmode", 'r', function (err) {
    if (err) {
        var DEV_MODE = false;
    } else {
        var DEV_MODE = true;
    }
});

var connectedToDB = false;
mongoose.connect(url);

mongoose.connection.on('connected', function () {
    connectedToDB = true;
    schema.Game.remove({}).exec();
    console.log("CONNECTED TO DB");
});

mongoose.connection.on('error', function (err) {
    connectedToDB = false;
});

mongoose.connection.on('disconnected', function () {
    connectedToDB = false;
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        process.exit(0);
    });
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public/res/favicon.ico')));

app.use(bodyParser.json({limit: '60mb'}));
app.use(bodyParser.urlencoded({limit: '60mb', extended: true}));

app.use(cookieParser());

app.use(session({
    name: 'session',
    secret: 'asdfak43*&^%%sdj@',
    maxAge: 0.5 * 60 * 60 * 1000
}));

app.get('/', function (req, res) {
    auth.checkAuthorized(req, function (authorized) {
        if (authorized) {
            res.redirect("./dashboard")
        } else {
            res.redirect("./home");
        }
    });
});

app.get('/list/users', function (req, res) {
    schema.User.find({}, function (err, result) {
        if (err) {
            throw err
        } else if (result.length) {
            res.send(result);
        } else {
            res.send("No document found");
        }
    });
});

app.get('/list/games', function (req, res) {
    schema.Game.find({}, function (err, result) {
        if (err) {
            throw err
        } else if (result.length) {
            res.send(result);
        } else {
            res.send("No document found");
        }
    });
});

app.post('/loginVerify', function (req, res) {
    switch (req.body.type) {
        case "google":
            client.verifyIdToken({
                idToken: req.body.token,
                audience: CLIENT_ID
            }, function (e, login) {
                var userData = login.getPayload();
                if (userData) {
                    users.upsertGoogleUser(userData, function (userToken) {
                        res.status(200).json({result: 'redirect', token: userToken, url: '../dashboard'});
                    });
                }
                else {
                    res.status(200).json({result: 'redirect', url: '../login'});
                }
            });
            break;
        case "local":
            users.loginUser(req.body, function (result) {
                if (result["status"] === "success") {
                    res.status(200).json({result: 'redirect', token: result.token, url: '../dashboard'});
                } else if (result["status"] === "invalid") {
                    res.send({result: 'invalid'});
                } else {
                    res.json({result: 'error'});
                }
            });
            break;
        default:
            res.status(200).send({result: 'redirect', url: '../login'});
            break;
    }
});

app.post('/verifyInfo', function (req, res) {
    var data = req.body.data;
    switch (req.body.field) {
        case "username":
            schema.User.find({username: data}).limit(1).count().exec(function (err, found) {
                res.json({taken: found > 0});
            });
            break;
        case "email":
            schema.User.find({email: data}).limit(1).count().exec(function (err, found) {
                res.json({taken: found > 0});
            });
            break;
        default:
            res.json({taken: NaN});
    }
});

app.post('/register', function (req, res) {
    users.createUser(req.body, function (result) {
        res.json(result);
    });
});

app.post('/joinGame', auth.isAuthorized, function (req, res) {
    games.joinGame(req.body.game_id, res);
});

app.post('/createGame', auth.isAuthorized, function (req, res) {
    games.createGame(req.body.game_type, res);
});

app.post('/settingsUpdate', auth.isAuthorized, function (req, res) {
    settings.update(req.body, res);
});

app.get('/home', function (req, res) {
    res.sendFile(__dirname + "/public/views/home.html");
});

app.get('/error', function (req, res) {
    res.sendFile(__dirname + "/public/views/error.html");
});

app.get('/about', function (req, res) {
    res.sendFile(__dirname + "/public/views/about.html");
});

app.get('/register', function (req, res) {
    res.sendFile(__dirname + "/public/views/register.html");
});

app.get('/login', function (req, res) {
    auth.checkAuthorized(req, function (authorized) {
        if (authorized) {
            res.redirect("../");
        } else {
            res.sendFile(__dirname + "/public/views/login.html");
        }
    });
});

app.get('/logout', function (req, res) {
    res.clearCookie("token");
    res.redirect('../');
});

app.get('/dashboard', auth.isAuthorized, function (req, res) {
    var data = {};
    data["name"] = res.locals.name;
    data["games"] = games.games;
    res.send(hbsHandler.export("dashboard", data));
});

app.get('/settings', auth.isAuthorized, function (req, res) {
    settings.getData(res.locals.id, function (data) {
        res.send(hbsHandler.export("settings", data));
    });
});

app.get('/play/*', auth.isAuthorized, function (req, res) {
    games.startGame(req.url, res);
});

app.get('/handlebars/navbar', function (req, res) {
    var data = {};
    var origin = "";

    // get how deep the link of the referrer is and set up the links in the nav bar accordingly
    try {
        origin = req.headers.referer.toString();
    } catch (err) {
        origin = "";
    }
    for (var i = 0; i < BASE_URLS.length; i++) {
        origin = origin.replace(BASE_URLS[i], "");
    }
    if (origin.charAt(origin.length - 1) === '/') {
        origin = origin.substr(0, origin.length - 1);
    }
    var level = (origin.match(/\//g) || []).length;
    data["baseurl"] = "../";
    for (var i = 0; i < level; i++) {
        data["baseurl"] = "../" + data["baseurl"];
    }
    auth.checkAuthorized(req, function (loggedin) {
        data["loggedin"] = loggedin;
        res.send(hbsHandler.export("navBar", data));
    });
});

app.use(function (req, res) {
    res.status(404).sendFile(__dirname + "/public/views/404.html");
});

server.listen(3000, function () {
    console.log("listenting on *:3000");
});
