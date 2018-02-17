
class UserBox extends React.Component {

    createBar(user) {
        console.log(user);
        return (
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <img src={user.user_image} height="50"/>
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

$(document).ready(function () {
    var socketURL = "/" + window.location.href.match("/.+\\/(.+)$")[1];
    console.log(socketURL);
    var socket = io(socketURL);

    socket.on('update users', function (msg) {
        ReactDOM.render(<UserBox users={msg}/>, document.getElementById("user-list"));
    })
});