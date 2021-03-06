
const TOKEN_EXPIRY_LENGTH = 2*60*60;
const TOKEN_SECRET = "tZlYtRubBS6L1U3!@K@$";

var jwt = require('jsonwebtoken');
var cookie = require('cookie');

// middleware function
module.exports.isAuthorized = function(req, res, next) {
    var token =  req.cookies["token"];
    if (token) {
        jwt.verify(token, TOKEN_SECRET, function(err, dec) {
            if (err) {
                res.status(403).redirect("../login");
            } else {
                res.locals.id = dec["id"];
                res.locals.name = dec["name"];
                next();
            }
        })
    } else {
        res.status(403).redirect("../login");
    }
};

module.exports.getTokenInfo = function(c, cb) {
    if (c) {
        var token = cookie.parse(c)["token"];
        jwt.verify(token, TOKEN_SECRET, function(err, dec) {
            if (err) {
               cb(null);
            } else {
                cb({
                    id: dec["id"],
                    name: dec["name"]
                });
            }
        })
    }
};

module.exports.checkAuthorized = function(req, callback) {
    var token =  req.cookies["token"];
    if (token) {
        jwt.verify(token, TOKEN_SECRET, function(err, dec) {
            if (err) {
                throw err;
            }
            callback({status: "success", id: dec["id"], name: dec["name"]});
        });
    } else {
        callback({status: "failed"});
    }
};


module.exports.getToken = function getToken(data) {
    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (TOKEN_EXPIRY_LENGTH),
        id: data["user_id"],
        name: data["username"]
    }, TOKEN_SECRET);
    return token;
};