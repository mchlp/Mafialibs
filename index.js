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
var format = require('util').format;
var bodyParser = require('body-parser');
var session = require('client-sessions');
var auth = new require('google-auth-library');
var client = new auth.OAuth2Client(CLIENT_ID, '', '');

var mongoose = require("mongoose");
var mongodb = require('mongodb');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    cookieName: 'session',
    secret: 'JM1qisCavgdTx8pVXzlf',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

app.get('/', function (req, res) {
    res.redirect("./home");
});

app.get('/list', function (req, res) {
    var MongoClient = mongodb.MongoClient;
    var url = format("mongodb://%s:%s@%s:%s/%s", DB_USERNAME, DB_PASSWORD, DB_ADDRESS, DB_PORT, DB_DATABASE);
    MongoClient.connect(url, function (err, db) {
        if (err) {
            throw err;
        } else {
            console.log("Connection established.");
            var dbo = db.db('mafialibs-db');

            var collection = dbo.collection('students');

            collection.find({}).toArray(function (err, result) {
                if (err) {
                    throw err
                } else if (result.length) {
                    res.send(result);
                } else {
                    res.send("No document found");
                }
            });

            collection.insertOne({name: "John Brown", grade: 9, gpa: 2.5});

            db.close();
        }
    });
});

app.get('/loginVerify', function(req, res) {
	res.send("verify login");
});

app.post('/loginVerify', function (req, res) {
    client.verifyIdToken({
        idToken: req.body.token,
        audience: CLIENT_ID
    }, function (e, login) {
        var payload = login.getPayload();
        var userid = payload['sub'];
        if (payload) {
            res.status(200).send({result: 'redirect', url:'../dashboard'});
        } else {
            res.status(200).send({result: 'redirect', url:'../login'});
        }
    });
});

app.get('/home', function(req, res) {
    res.sendFile(__dirname + "/public/views/home.html");
});

app.get('/about', function(req, res) {
   res.sendFile(__dirname + "/public/views/about.html");
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + "/public/views/login.html");
});

app.get('/dashboard', function(req, res) {
    res.send("Dashboard.");
});

app.use(function (req, res) {
    res.status(404).send("Page not found!");
});

http.listen(3000, function () {
    console.log("listenting on *:3000");
})
