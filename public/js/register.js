
const VALID_USERNAME = /^\w{1,16}$/;
const VALID_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const VALID_PASSWORD = /^\S{6,32}$/;

$(document).ready(function () {
    $("#register-form")[0].addEventListener('submit', registerSubmit);
    $("#username-input").change(usernameChange);
    $("#email-input").change(emailChange);
    $("#password-input").change(passwordChange);
    $("#password-confirm-input").change(passwordConfirmChange);

});

function usernameChange() {
    let username = $('#username-input').val().trim();
    if (username === "") {
        $("#username-feedback").text("Please provide a username.");
        setValidStatus($("#username-input"), false);
    } else if (!VALID_USERNAME.test(username)) {
        $("#username-feedback").text("Your username can only contain alphanumeric characters (a-z, A-Z, 0-9) and underscores (_). It must be between 1 and 16 characters long.");
        setValidStatus($("#username-input"), false);
    } else {
            $.ajax({
            type: "POST",
            url: "../verifyInfo/",
            data: {field: "displayname", data: username},
            success: function (res) {
                if (res.taken) {
                    setValidStatus($("#username-input"), false);
                    $("#username-feedback").text("That username is already taken.");
                } else {
                    setValidStatus($("#username-input"), true);
                }
            },
            dataType: "json"
        })
    }
}

function emailChange() {
    let email = $("#email-input").val().trim();
    if (!VALID_EMAIL.test(email)) {
        $("#email-feedback").text("Please provide a valid email.");
        setValidStatus($("#email-input"), false);
    } else {
        $.ajax({
            type: "POST",
            url: "../verifyInfo/",
            data: {field: "email", data: email},
            success: function (res) {
                if (res.taken) {
                    setValidStatus($("#email-input"), false);
                    $("#email-feedback").text("That email is already taken.");
                } else {
                    setValidStatus($("#email-input"), true);
                }
            },
            dataType: "json"
        })
    }
}

function passwordChange() {
    let password = $('#password-input').val().trim();
    if (password === "") {
        $("#password-feedback").text("Please provide a password.");
        setValidStatus($("#password-input"), false);
    } else if (!VALID_PASSWORD.test(password)) {
        $("#password-feedback").text("Your password cannot contain spaces and must be between 6 and 32 characters long.");
        setValidStatus($("#password-input"), false);
    } else {
        setValidStatus($("#password-input"), true)
    }
}

function passwordConfirmChange() {
    let passwordConfirm = $('#password-confirm-input').val().trim();
    if (passwordConfirm === $("#password-input").val()) {
        setValidStatus($("#password-confirm-input"), true);
    } else {
        setValidStatus($("#password-confirm-input"), false);
    }
}

function setValidStatus(component, valid) {
    if (valid) {
        $(component).removeClass("is-invalid").addClass("is-valid");
    } else {
        $(component).removeClass("is-valid").addClass("is-invalid");
    }
}

function registerSubmit(event) {

    var valid = true;

    usernameChange();
    emailChange();
    passwordChange();
    passwordConfirmChange();

    var customFields = $(".needs-custom-validation");
    Array.prototype.filter.call(customFields, function (field) {
        if (!$(field).hasClass('is-valid')) {
            event.preventDefault();
            event.stopPropagation();
            valid = false;
        }
    });


    if (!$("#register-form")[0].checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        valid = false;
    }

    if (valid) {
        var hash = sha256($("#username-input").val().trim().toLowerCase()+$('#password-input').val().trim());
        $.ajax({
            type: "POST",
            url: "./register/",
            data: {
                username: $("#username-input").val().trim().toLowerCase(),
                email: $("#email-input").val().trim(),
                password: hash
            },
            success: function (res) {
                var status = res.status;
                console.log(status);
                if (status === "success") {
                    window.location.replace("../login");
                } else {
                    $('#alert').first().removeClass('d-none');
                    $("#alert").removeClass("alert-warning").addClass("alert-danger");
                    $("#alert-text").text("An error has occured with the server. Try reloading the page and trying again later.");
                    window.scrollTo(0, 0);
                }
            },
            dataType: "json"
        });
    }
}