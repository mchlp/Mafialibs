function onSuccess(googleUser) {
    var token = googleUser.getAuthResponse().id_token;
    $.ajax({
        type: "POST",
        url: "../loginVerify/",
        data: {"token": token},
        success: function (res) {
            if (res.result === 'redirect') {
                document.cookie = "token=" + res.token + "; path=/;";
                setTimeout(function () {
                    window.location.replace(res.url)
                }, 1000);
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
