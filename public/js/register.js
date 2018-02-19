
const VALID_USERNAME = /^\w{1,16}$/;
const VALID_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const VALID_PASSWORD = /^\S{6,32}$/;
const VALID_NAME = /^[a-zA-Z]{1,20}$/;

$(document).ready(function () {
    $("#register-form")[0].addEventListener('submit', registerSubmit);
    $("#firstname-input").change(firstnameChange);
    $("#lastname-input").change(lastnameChange);
    $("#username-input").change(usernameChange);
    $("#email-input").change(emailChange);
    $("#password-input").change(passwordChange);
    $("#password-confirm-input").change(passwordConfirmChange);

});

function firstnameChange() {
    let firstname = $('#firstname-input').val().trim();
    if (firstname === "") {
        $("#firstname-feedback").text("Please provide a first name.");
        setValidStatus($("#firstname-input"), false);
    } else if (!VALID_NAME.test(firstname)) {
        $("#firstname-feedback").text("Your first name can only contain letters and must be between 1 and 20 characters long.");
        setValidStatus($("#firstname-input"), false);
    } else {
        setValidStatus($("#firstname-input"), true)
    }
}

function lastnameChange() {
    let lastname = $('#lastname-input').val().trim();
    if (lastname === "") {
        $("#lastname-feedback").text("Please provide a last name.");
        setValidStatus($("#lastname-input"), false);
    } else if (!VALID_NAME.test(lastname)) {
        $("#lastname-feedback").text("Your lastname name can only contain letters and must be between 1 and 20 characters long.");
        setValidStatus($("#lastname-input"), false);
    } else {
        setValidStatus($("#lastname-input"), true)
    }
}

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
            data: {field: "username", data: username},
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
    passwordConfirmChange();
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

    firstnameChange();
    lastnameChange();
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
        var hash = sha256($('#password-input').val().trim());
        $.ajax({
            type: "POST",
            url: "./register/",
            data: {
                firstName: $("#firstname-input").val().trim(),
                lastName: $("#lastname-input").val().trim(),
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