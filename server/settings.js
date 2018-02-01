var schema = require("./schema");

module.exports.getData = function (id, callback) {
    schema.User.findOne({"_id": id}, function (err, curUser) {
        var userData = {
            image: curUser.picURL,
            fields: [
                {
                    id: "first-name",
                    label: "First Name",
                    value: curUser.firstName,
                    feedbackText: false,
                    attributes: "readonly"
                },
                {
                    id: "last-name",
                    label: "Last Name",
                    value: curUser.lastName,
                    feedbackText: false,
                    attributes: "readonly"
                },
                {
                    id: "display-name",
                    label: "Display Name",
                    value: curUser.displayName,
                    feedbackText: true,
                    attributes: ""
                },
                {
                    id: "email",
                    label: "Email",
                    value: curUser.email,
                    feedbackText: false,
                    attributes: "readonly"
                },
                {
                    id: "last-login",
                    label: "Last Login",
                    value: new Date(curUser.lastLogin).toLocaleString(),
                    feedbackText: false,
                    attributes: "readonly"
                },
                {
                    id: "account-created",
                    label: "Account Created",
                    value: new Date(curUser.created).toLocaleString(),
                    feedbackText: false,
                    attributes: "readonly"
                },
                {
                    id: "numGames",
                    label: "Number of Games Played",
                    value: curUser.gameCount,
                    feedbackText: false,
                    attributes: "readonly"
                }
            ]
        };
        callback(userData);
    });
};