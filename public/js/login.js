
const DEV_MODE = false;

$(document).ready(function() {
   $("#login-form")[0].addEventListener('submit', logInSubmit);
});

function onSuccess(googleUser) {
    var token = googleUser.getAuthResponse().id_token;
    $.ajax({
        type: "POST",
        url: "../loginVerify/",
        data: {
            token: token
        },
        success: function (res) {
            if (res.result === 'redirect') {
                document.cookie = "token=" + res.token + "; path=/;";
                window.location.replace(res.url);
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

function logInSubmit(event) {
    var valid = true;
    if (!$("#login-form")[0].checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        valid = false;
    }
    if (!DEV_MODE) {
        if (window.location.protocol !== "https:") {
            $("#alert").val("You are using an inse")
        }
    }
    $("#login-form").addClass("was-validated");
    if (valid) {
        alert("VALID FORM!")
    }
}