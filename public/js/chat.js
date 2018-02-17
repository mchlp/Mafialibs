
$(document).ready(function() {
    var socketURL = "/" + window.location.href.match("/.+\\/(.+)$")[1];
    console.log(socketURL);
    var socket = io(socketURL);
});