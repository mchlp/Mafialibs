class UserBox extends React.Component {

    createBar(user) {
        var picLink = getURL(user.user_image, 1);
        return (
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <img class="rounded" src={picLink} height="50"/>
                <p class="align-middle text-center m-0">{user.user_name}</p>
            </div>
        );
    }

    render() {
        return (
            <div class="list-group" id="user-list">
                {this.createBars(this.props.users)}
            </div>
        )
    }

    createBars(users) {
        return users.map(this.createBar);
    }
}

class MessageBox extends React.Component {

    render() {
        return (
            <ul class="list-unstyled" id="message-area">
                {this.createMessages(this.props.msgList)}
            </ul>
        )
    }

    createMessage(msg) {
        var picLink = getURL(msg.user_image, 1);
        return (
            <li class="clearfix chat-message-block">
                        <span class="float-left">
                        <img class="rounded" src={picLink} height="45px"/>
                        </span>
                <div class="chat-message-body p-2 rounded">
                    <div class="chat-message-header p-1">
                        <strong>{msg.user_name}</strong>
                        <small class="float-right">{Math.floor((new Date() - new Date(msg.time)) / (1000 * 60))} min(s)
                            ago
                        </small>
                    </div>
                    <div class="p-1">
                        {msg.text}
                    </div>
                </div>
            </li>
        );
    }

    componentDidMount() {
        this.updateTimeInterval = setInterval(function () {
            updateChatTimes();
        }, 1000 * 30);
    }

    componentWillUnmount() {
        clearInterval(this.updateTimeInterval);
    }

    createMessages(msgList) {
        return msgList.map(this.createMessage);
    }
}

var msgList = [];

$(document).ready(function () {
    var socketURL = "/" + window.location.href.match(".+\\/([^\\/]+)(\\/?)$")[1];
    console.log(socketURL);
    var socket = io(socketURL);

    socket.on('update-users', function (msg) {
        console.log("UPDATE USERS " + msg);
        ReactDOM.render(<UserBox users={msg}/>, document.getElementById("user-list"));
    });

    socket.on('message-to-client', function (msg) {
        msgList.push(msg);
        updateChatTimes();
        $("#chat-text-area")[0].scrollTop = $("#chat-text-area")[0].scrollHeight;
    });

    $("#chat-input")[0].addEventListener('submit', function (event) {
        var sendMsg = $("#chat-input-field").val().trim();
        if (sendMsg != "") {
            socket.emit('message-to-server', $("#chat-input-field").val());
            $("#chat-input-field").val("");
        }
    });
});

function updateChatTimes() {
    ReactDOM.render(<MessageBox msgList={msgList}/>, document.getElementById("message-area"));
}