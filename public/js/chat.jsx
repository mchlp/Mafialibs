
$(document).ready(function() {
    var socketURL = "/" + window.location.href.match("/.+\\/(.+)$")[1];
    console.log(socketURL);
    var socket = io(socketURL);

    socket.on('update users', function(msg) {
        $("#user-list").empty();
        for (var i=0; i<msg.length; i++) {
            var user = msg[i];
            ReactDOM.render(<h1>Hello World</h1>, document.getElementById("user-list"));
            /*$("#user-list").ap
            <div class="list-group-item d-flex justify-content-between align-items-center active">
                <img src="../data/google_114909863284889204016.jpg" height="50">
                <p class="align-middle text-center m-0">Test</p>
                </div>*/
        }
        console.log(msg);
    })
});