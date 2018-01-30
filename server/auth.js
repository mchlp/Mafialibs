
const TOKEN_EXPIRY_LENGTH = 60;
const TOKEN_SECRET = "tZlYtRubBS6L1U3!@K@$";

var jwt = require('jsonwebtoken');

module.exports.isAuthorized = function(req, res, next) {
    var token =  req.cookies["token"];
    if (token) {
        jwt.verify(token, TOKEN_SECRET, function(err, dec) {
            if (err) {
                res.status(403).json({message: "Unauthorized."});
            } else {
                res.locals.id = dec["id"];
                res.locals.name = dec["name"];
                next();
            }
        })
    } else {
        res.status(403).json({message: "Unauthorized."});
    }
};

module.exports.checkAuthorized = function(req, callback) {
    var token =  req.cookies["token"];
    if (token) {
        jwt.verify(token, TOKEN_SECRET, function(err) {
            console.log("TOKEN ERROR: ", err == null);
            callback(err == null);
        });
    } else {
        callback(false);
    }
};


module.exports.getToken = function getToken(data) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (TOKEN_EXPIRY_LENGTH),
        id: data["sub"],
        name: data["given_name"]
    }, TOKEN_SECRET);
};