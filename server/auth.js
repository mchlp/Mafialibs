
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
                console.log(dec);
                res.locals.id = dec["id"];
                res.locals.name = dec["name"];
                next();
            }
        })
    }
};


module.exports.getToken = function getToken(data) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (TOKEN_EXPIRY_LENGTH),
        id: data["sub"],
        name: data["given_name"]
    }, TOKEN_SECRET);
};