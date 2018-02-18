var schema = require("./schema");
var auth = require("./auth");

module.exports.upsertGoogleUser = function (userData, callback) {
    schema.User.find({_id: "google_" + userData["sub"]}).limit(1).count().exec(function (err, found) {
        console.log("LOG IN");
        if (err) throw err;
        var curUser;
        if (found > 0) {
            // update user
            curUser = {
                _id: "google_" + userData["sub"],
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
                _id: "google_" + userData["sub"],
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
        var userID = curUser["_id"];
        var query = {_id: userID};
        schema.User.findOneAndUpdate(query, curUser, {
                upsert: true
            },
            function (err, doc) {
                if (err) throw err;
                var userToken = auth.getToken(doc);
                callback(userToken);
            });
    });
};

module.exports.updateDetails = function (userID, details, callback) {
    var query = {_id: userID};
    schema.User.findOneAndUpdate(query, details, function (err, doc) {
        if (err) {
            callback(false);
            throw err;
        }
        callback(true);
    });
}