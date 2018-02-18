
$(document).ready(function () {
    $("#game-join-form")[0].addEventListener('submit', function(event) {
        var gameID = $("#game-id").val().trim();
        joinGame(gameID);
    });
    $("#game-create-form")[0].addEventListener('submit', function(event) {
        var gameType = $("#game-type").val();
        createGame(gameType);
    })
});

function createGame(gameType) {
    $.ajax({
        type: "POST",
        url: "../createGame/",
        data: {
            game_type: gameType
        },
        success: function(res) {
            if (res.url) {
                window.location.replace(res.url)
            }
        },
        dataType: "json"
    })
}

function joinGame(gameID) {
    $.ajax({
        type: "POST",
        url: "../joinGame/",
        data: {
            game_id: gameID
        },
        success: function (res) {
            var status = res.status;
            if (status == "success") {
                $("#invalid-id-label").addClass("d-none");
                window.location.replace(res.url)
            } else {
                $("#invalid-id-label").removeClass("d-none");
            }
        },
        dataType: "json"
    })
}