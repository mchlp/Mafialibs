
const VALID_PASSWORD = /^\S{6,32}$/;

$(document).ready(function () {
    $("#change-password-form")[0].addEventListener('submit', changeSubmit);
    $("#password-input").change(passwordChange);
    $("#password-new-input").change(passwordNewChange);
    $("#password-new-confirm-input").change(passwordNewConfirmChange);
});

function passwordChange() {
    let password = $('#password-input').val().trim();
    if (password === "") {
        $("#password-feedback").text("Please provide a password.");
        setValidStatus($("#password-input"), false);
    } else {
        var hash = sha256($('#password-input').val().trim());
        $.ajax({
            type: "POST",
            url: "../loginVerify/",
            data: {
                type: "verify",
                password: hash
            },
            success: function (res) {
                if (res.result === 'success') {
                    setValidStatus($("#password-input"), true);
                } else if (res.result === 'invalid') {
                    $("#password-feedback").text("The password you entered is not your current password.");
                    setValidStatus($("#password-input"), false);
                } else {
                    $("#error-alert").removeClass("d-none");
                }
            },
            dataType: "json"
        });
    }
}

function passwordNewConfirmChange() {
    let passwordNewConfirm = $('#password-new-confirm-input').val().trim();
    if (passwordNewConfirm === $("#password-new-input").val()) {
        setValidStatus($("#password-new-confirm-input"), true);
    } else {
        setValidStatus($("#password-new-confirm-input"), false);
    }
}

function passwordNewChange() {
    let passwordNew = $('#password-new-input').val().trim();
    if (passwordNew === "") {
        $("#password-new-feedback").text("Please provide a new password.");
        setValidStatus($("#password-new-input"), false);
    } else if (!VALID_PASSWORD.test(passwordNew)) {
        $("#password-new-feedback").text("Your password cannot contain spaces and must be between 6 and 32 characters long.");
        setValidStatus($("#password-new-input"), false);
    } else {
        setValidStatus($("#password-new-input"), true)
    }
    passwordNewConfirmChange();
}

function setValidStatus(component, valid) {
    if (valid) {
        $(component).removeClass("is-invalid").addClass("is-valid");
    } else {
        $(component).removeClass("is-valid").addClass("is-invalid");
    }
}

function changeSubmit() {

    passwordChange();
    passwordNewChange();
    passwordNewConfirmChange();

    valid = true;

    var customFields = $(".needs-custom-validation");
    Array.prototype.filter.call(customFields, function (field) {
        if (!$(field).hasClass('is-valid')) {
            event.preventDefault();
            event.stopPropagation();
            valid = false;
        }
    });

    if (!$("#change-password-form")[0].checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        valid = false;
    }

    if (valid) {
        var oldHash = sha256($('#password-input').val().trim());
        var newHash = sha256($('#password-new-input').val().trim());
        $.ajax({
            type: "POST",
            url: "../passwordUpdate/",
            data: {
                old: oldHash,
                new: newHash,
            },
            success: function (res) {
                if (res.result === 'redirect') {
                    window.location.replace(res.url);
                } else if (res.result === 'invalid') {
                    $("#password-feedback").text("The password you entered is not your current password.");
                    setValidStatus($("#password-input"), false);
                } else {
                    $("#error-alert").removeClass("d-none");
                }
            },
            dataType: "json"
        });
    }
}