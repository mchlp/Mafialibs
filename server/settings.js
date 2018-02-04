var schema = require("./schema");
var users = require('./users');
var jimp = require('jimp');

module.exports.getData = function (id, callback) {
    schema.User.findOne({"_id": id}, function (err, curUser) {
        var userData = {
            image: curUser.picURL,
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
                    id: "display-name",
                    label: "Display Name",
                    value: curUser.displayName,
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
                    value: new Date(curUser.lastLogin).toLocaleString(),
                    validation: false,
                    attributes: "readonly"
                },
                {
                    id: "account-created",
                    label: "Account Created",
                    value: new Date(curUser.created).toLocaleString(),
                    validation: false,
                    attributes: "readonly"
                },
                {
                    id: "numGames",
                    label: "Number of Games Played",
                    value: curUser.gameCount,
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
        newData["picURL"] =  "../" + newImageLink;
    }
    newData["displayName"] = data.display_name;
    users.updateDetails(userID, newData, function(success) {
        if (success) {
            res.json({status: "success"});
        } else {
            res.json({status: "failed"})
        }
    });
};