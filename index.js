const DB_USERNAME = "mafialibs-user";
const DB_PASSWORD = "mafialibs123";
const DB_ADDRESS = "127.0.0.1";
const DB_PORT = "27017";
const DB_DATABASE = "mafialibs-db";
const CLIENT_ID = "61123325910-bqfncmh15jgfg2o1millsnbd9k3floku.apps.googleusercontent.com";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var session = require('cookie-session');
var format = require('util').format;
var bodyParser = require('body-parser');
var googleAuth = new require('google-auth-library');
var client = new googleAuth.OAuth2Client(CLIENT_ID, '', '');
var cookieParser = require('cookie-parser');
var auth = require("./server/auth");
var schema = require("./server/schema");
var settings = require("./server/settings");
var users = require("./server/users");

var mongoose = require('mongoose');
var url = format("mongodb://%s:%s@%s:%s/%s", DB_USERNAME, DB_PASSWORD, DB_ADDRESS, DB_PORT, DB_DATABASE);

var hbsHandler = require('./server/hbsHelper');
hbsHandler.compileTemplates();

var connectedToDB = false;
mongoose.connect(url);

mongoose.connection.on('connected', function () {
    connectedToDB = true;
    console.log("CONNECTED");
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

app.use(bodyParser.urlencoded({extended: true}));

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

app.get('/list', function (req, res) {
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

app.get('/loginVerify', function (req, res) {
    res.send("verify login");
});

app.post('/loginVerify', function (req, res) {
    client.verifyIdToken({
        idToken: req.body.token,
        audience: CLIENT_ID
    }, function (e, login) {
        var userData = login.getPayload();
        if (userData) {
            users.createGoogeUser(userData, function(userToken) {
                res.status(200).send({result: 'redirect', token: userToken, url: '../dashboard'});
            });
        }
        else {
            res.status(200).send({result: 'redirect', url: '../login'});
        }
    });
});

app.post('/displayNameVerify', function (req, res) {
    var searchName = req.body.name;
    schema.User.find({displayName: searchName}).limit(1).count().exec(function (err, found) {
        res.json({taken: found > 0});
    })
});

app.post('/settingsUpdate', auth.isAuthorized, function (req, res) {
    settings.update(req.body, res);
});

app.get('/home', function (req, res) {
    res.sendFile(__dirname + "/public/views/home.html");
});

app.get('/about', function (req, res) {
    res.sendFile(__dirname + "/public/views/about.html");
});

app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/public/views/login.html");
});

app.get('/logout', function (req, res) {
    res.clearCookie("token");
    res.redirect('../')
});

app.get('/dashboard', auth.isAuthorized, function (req, res) {
    var data = {};
    data["name"] = res.locals.name;
    res.send(hbsHandler.export("dashboard", data));
});

app.get('/settings', auth.isAuthorized, function (req, res) {
    settings.getData(res.locals.id, function(data) {
        res.send(hbsHandler.export("settings", data));
    });
});

app.get('/handlebars/navbar', function (req, res) {
    var data = {};
    auth.checkAuthorized(req, function (loggedin) {
        data["loggedin"] = loggedin;
        res.send(hbsHandler.export("navBar", data));
    });
});

app.use(function (req, res) {
    res.status(404).send("Page not found!");
});

http.listen(3000, function () {
    console.log("listenting on *:3000");
});