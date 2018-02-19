
$(document).ready(function() {
   $("#login-form")[0].addEventListener('submit', logInSubmit);
});

function onSuccess(googleUser) {
    var token = googleUser.getAuthResponse().id_token;
    $.ajax({
        type: "POST",
        url: "../loginVerify/",
        data: {
            type: "google",
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
    $("#login-form").addClass("was-validated");
    var valid = true;
    if (!$("#login-form")[0].checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        valid = false;
    }
    if (valid) {
        $("#invalid-cred-alert").addClass("d-none");
        $("#error-alert-alert").addClass("d-none");
        var hash = sha256($("#username-input").val().trim().toLowerCase()+$('#password-input').val().trim());
        $.ajax({
            type: "POST",
            url: "../loginVerify/",
            data: {
                type: "local",
                username: $("#username-input").val().trim().toLowerCase(),
                password: hash
            },
            success: function (res) {
                console.log(res);
                if (res.result === 'redirect') {
                    document.cookie = "token=" + res.token + "; path=/;";
                    window.location.replace(res.url);
                } else if (res.result === 'invalid') {
                    $("#invalid-cred-alert").removeClass("d-none");
                } else {
                    $("#error-alert").removeClass("d-none");
                }
            },
            dataType: "json"
        });
    }
}