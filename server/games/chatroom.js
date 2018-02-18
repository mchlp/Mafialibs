
var schema = require("../schema");

module.exports.setupChat = function(id, socket, serverSocket) {
    socket.on('message-to-server', function(msg) {
        schema.Game.findOne({game_id: id}, function(err, doc) {
            if (err) {throw err}
            var userList = doc["users_secret"];
            for (var i=0; i<userList.length; i++) {
                if (userList[i]["socket"] === socket.id) {
                    var sendMsg = {
                        user_name: userList[i]["user_name"],
                        user_image: userList[i]["user_image"],
                        time: new Date(),
                        text: msg
                    };
                    serverSocket.emit('message-to-client', sendMsg);
                }
            }
        });
    });
};