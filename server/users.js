var schema = require("./schema");
var auth = require("./auth");
var uuidv4 = require('uuid/v4');
var bcrypt = require('bcryptjs');

module.exports.createUser = function (userData, callback) {

    var password = userData["password"];
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    schema.User.create({
        user_id: uuidv4(),
        firstName: userData["firstName"],
        lastName: userData["lastName"],
        fullName: userData["firstName"] + " " + userData["lastName"],
        username: userData["username"],
        source: "local",
        emailVerified: false,
        email: userData["email"],
        pic_url: "../data/default.png",
        lastLogin: Date.now(),
        created: Date.now(),
        game_count: 0,
        password: hash,
        salt: salt
    }, function (err) {
        if (err) {
            callback({status: "error"});
            throw err;
        } else {
            callback({status: "success"});
        }
    })
};

module.exports.verifyUser = function(user_id, password, callback) {
    schema.User.findOne({user_id: user_id}, function(err, found) {
        if (err) {
            callback({status: "error"});
            throw err;
        } else {
            if (found) {
                var salt = found["salt"];
                var hash = bcrypt.hashSync(password, salt);
                if (hash === found["password"]) {
                    callback({status: "success"});
                } else {
                    callback({status: "invalid"});
                }
            } else {
                callback({status: "error"});
            }
        }
    })
};

module.exports.loginUser = function (userData, callback) {
    schema.User.findOne({username: userData["username"]}, function(err, found) {
        if (err) {
            callback({status:"error"});
            throw err;
        } else {
            if (found) {
                var password = userData["password"];
                var salt = found["salt"];
                var hash = bcrypt.hashSync(password, salt);
                if (hash == found["password"]) {
                    updatedInfo = {
                        lastLogin: Date.now(),
                    };
                    schema.User.findOneAndUpdate({username: userData["username"]}, updatedInfo, {new: true}, function(err, found) {
                        if (err) {
                            callback({status: "error"});
                            throw err;
                        } else {
                            var userToken = auth.getToken(found);
                            callback({status: "success", token: userToken});
                        }
                    });
                } else {
                    callback({status: "invalid"});
                }
            } else {
                callback({status: "invalid"});
            }
        }
    });
};

module.exports.upsertGoogleUser = function (userData, callback) {
    schema.User.find({user_id: "google_" + userData["sub"]}).limit(1).count().exec(function (err, found) {
        console.log("LOG IN");
        if (err) throw err;
        var curUser;
        if (found > 0) {
            // update user
            curUser = {
                user_id: "google_" + userData["sub"],
                firstName: userData["given_name"],
                lastName: userData["family_name"],
                fullName: userData["name"],
                source: "google",
                emailVerified: userData["email_verified"],
                email: userData["email"],
                lastLogin: Date.now()
            }
        } else {
            // new user
            curUser = {
                user_id: "google_" + userData["sub"],
                firstName: userData["given_name"],
                lastName: userData["family_name"],
                username: userData["given_name"],
                fullName: userData["name"],
                source: "google",
                emailVerified: userData["email_verified"],
                email: userData["email"],
                pic_url: userData["picture"],
                created: Date.now(),
                lastLogin: Date.now(),
                game_count: 0
            };
        }
        var userID = curUser["user_id"];
        var query = {user_id: userID};
        schema.User.findOneAndUpdate(query, curUser, {
                upsert: true,
                new: true
            },
            function (err, doc) {
                if (err) throw err;
                var userToken = auth.getToken(doc);
                callback(userToken);
            });
    });
};

module.exports.updateDetails = function (userID, details, callback) {
    var query = {user_id: userID};
    schema.User.findOneAndUpdate(query, details, function (err, doc) {
        if (err) {
            callback(false);
            throw err;
        }
        callback(true);
    });
}