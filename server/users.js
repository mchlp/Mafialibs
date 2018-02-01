
var schema = require("./schema");
var auth = require("./auth");

module.exports.createGoogeUser = function(userData, callback) {
    var userID = userData["sub"];
    var query = {_id: "google_" + userID};
    var curUser = {
        _id: "google_"+userData["sub"],
        firstName: userData["given_name"],
        lastName: userData["family_name"],
        displayName: userData["given_name"],
        fullName: userData["name"],
        source: "google",
        emailVerified: userData["email_verified"],
        email: userData["email"],
        picURL: userData["picture"],
        lastLogin: new Date().toISOString()
    };
    schema.User.findOneAndUpdate(query, curUser, {
            upsert: true
        },
        function (err, doc) {
            if (err) throw err;
            var userToken = auth.getToken(curUser);
            callback(userToken);
        });
};