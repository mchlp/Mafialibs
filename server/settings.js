var schema = require("./schema");
var users = require('./users');
var jimp = require('jimp');

module.exports.getData = function (id, callback) {
    schema.User.findOne({user_id: id}, function (err, curUser) {
        var userData = {
            local: curUser.source === 'local',
            image: curUser.pic_url,
            fields: [
                {
                    id: "first-name",
                    label: "First Name",
                    value: curUser.firstName,
                    validation: false,
                    attributes: "readonly"
                },
                {
                    id: "last-name",
                    label: "Last Name",
                    value: curUser.lastName,
                    validation: false,
                    attributes: "readonly"
                },
                {
                    id: "username",
                    label: "Username",
                    value: curUser.username,
                    validation: true,
                    attributes: ""
                },
                {
                    id: "email",
                    label: "Email",
                    value: curUser.email,
                    validation: false,
                    attributes: "readonly"
                },
                {
                    id: "last-login",
                    label: "Last Login",
                    value: curUser.lastLogin,
                    validation: false,
                    attributes: "readonly"
                },
                {
                    id: "account-created",
                    label: "Account Created",
                    value: curUser.created,
                    validation: false,
                    attributes: "readonly"
                },
                {
                    id: "num-games",
                    label: "Number of Games Played",
                    value: curUser.game_count,
                    validation: false,
                    attributes: "readonly"
                },
                {
                    id: "account-type",
                    label: "Account Type",
                    value: curUser.source.replace(/^[a-z]/, function (x) {return x.toUpperCase()}),
                    validation: false,
                    attributes: "readonly"
                }
            ]
        };
        callback(userData);
    });
};

module.exports.update = function (data, res) {
    var userID = res.locals.id;
    var newData = {};
    if (data.image != "") {
        var imageData = data.image.replace(/^data:image\/\w+;base64,/, "");
        var buffer = new Buffer(imageData, 'base64');
        var newImageLink = "data/" + userID + ".jpg";
        jimp.read(buffer).then(function (image) {
            image.resize(100, 100)
                .write("./public/" + newImageLink);
        });
        newData["pic_url"] =  "../" + newImageLink;
    }
    newData["username"] = data.username;
    newData["userName"] =
    users.updateDetails(userID, newData, function(success) {
        if (success) {
            res.json({status: "success"});
        } else {
            res.json({status: "failed"})
        }
    });
};