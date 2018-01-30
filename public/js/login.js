
function onSuccess(googleUser) {
    var token = googleUser.getAuthResponse().id_token;
    console.log(token);
    $.ajax({
        type: "POST",
        url: "../loginVerify/",
        data: {"token": token},
        success: function(res) {
		console.log(res);
            if (res.result === 'redirect') {
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
