var schema = require("./schema");
var auth = require("./auth");

module.exports.createUser = function (userData, callback) {
    schema.User.create({
        firstName: userData["username"],
        lastName: "",
        fullName: userData["username"],
        displayName: userData["username"],
        source: "local",
        emailVerified: false,
        email: userData["email"],
        picURL: "../data/default.png",
        lastLogin: Date.now(),
        created: Date.now(),
        game_count: 0
    }, function (err) {
        if (err) {
            callback({status: "error"});
            throw err;
        } else {
            callback({status: "success"});
        }
    })
};

module.exports.loginUser = function (userData, callback) {
    updatedInfo = {
        lastLogin: Date.now(),
    };
    schema.User.findOneAndUpdate({displayName: userData["username"]}, updatedInfo, function (err, found) {
        if (err) {
            callback({status: "error"});
        } else {
            callback({status: "success"})
        }
    })
}

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
                displayName: userData["given_name"],
                fullName: userData["name"],
                source: "google",
                emailVerified: userData["email_verified"],
                email: userData["email"],
                picURL: userData["picture"],
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