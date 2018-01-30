
function onSuccess(googleUser) {
    var token = googleUser.getAuthResponse().id_token;
    console.log(token);
    $.ajax({
        type: "POST",
        url: "../login",
        data: {"token": token},
        success: function(data) {
            if (data["status"] === "good") {
                window.location.replace("../views/dashboard.html");
            }
        },
        dataType: "json"
    });
}

function onFailure(error) {
    console.log(error);
}

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 250,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}
