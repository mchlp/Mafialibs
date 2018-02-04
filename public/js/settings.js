const MAX_FILE_SIZE = 50000000;

var orignalName;
var testImage;

$(document).ready(function () {

    testImage = new Image();

    testImage.onload = function () {
        if (this.width != this.height) {
            $('#alert').first().removeClass('d-none');
            $('#alert-text').first().text("The image you selected does not have the same width and height. " +
                "It will be automatically resized into a square. " +
                "To prevent this from happening, select an image that has the same width and height.");
        }
    };

    var forms = $(".needs-validation");
    var customFields = $(".needs-custom-validation");
    Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            var isvalid = true;
            $(form).removeClass('was-validated');
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                isvalid = false;
            }
            Array.prototype.filter.call(customFields, function (field) {
                if (!$(field).hasClass('custom-validated')) {
                    event.preventDefault();
                    event.stopPropagation();
                    isvalid = false;
                }
            });
            if (isvalid) {
                $(form).addClass('was-validated');
                updateSettings();
            }
        })
    });

    orignalName = $('#display-name').val();

    $('#display-name').change(updateDisplayName);
    updateDisplayName();

    $('#profile-pic-input').change(updateProfilePic);
});

function updateProfilePic() {
    var newFile = $('#profile-pic-input')[0].files[0];
    if (newFile) {
        $('#alert').first().addClass('d-none');
        $('#profile-pic-input').removeClass().addClass('custom-file-input needs-custom-validation');
        $("#profile-pic-label").text(newFile.name);
        if (newFile.size > MAX_FILE_SIZE) {
            $('#profile-pic-input').addClass('is-invalid');
            $('#image-feedback').addClass('invalid-feedback').text("The uploaded image has a size of " + newFile.size / 1000000 + " MB, which exceeds the maximum size of " + MAX_FILE_SIZE / 1000000 + "MB.");
        } else {
            $('#profile-pic-input').addClass('custom-validated is-valid');
            $('#image-feedback').removeClass('invalid-feedback').addClass('valid-feedback').text("The uploaded image looks good!");
            testImage.src = window.URL.createObjectURL(newFile);
        }
    }
}

function updateDisplayName() {
    var curName = $('#display-name').val();
    if (curName === orignalName) {
        $('#display-name').addClass('custom-validated').addClass("is-valid").removeClass("is-invalid");
        $('#display-name-feedback').addClass("valid-feedback").removeClass("invalid-feedback").text("Looks good!");
    } else if (curName.match(" ") != null) {
        $('#display-name').removeClass('custom-validated').removeClass("is-valid").addClass("is-invalid");
        $('#display-name-feedback').removeClass("valid-feedback").addClass("invalid-feedback").text("You cannot have spaces in your display name.");
    } else {
        $.ajax({
            type: "POST",
            url: "../displayNameVerify/",
            data: {"name": $('#display-name').val()},
            success: function (res) {
                if (res.taken) {
                    $('#display-name').removeClass('custom-validated').removeClass("is-valid").addClass("is-invalid");
                    $('#display-name-feedback').removeClass("valid-feedback").addClass("invalid-feedback").text("That display name is already taken.");
                } else {
                    $('#display-name').addClass('custom-validated').addClass("is-valid").removeClass("is-invalid");
                    $('#display-name-feedback').addClass("valid-feedback").removeClass("invalid-feedback").text("Looks good!");
                }
            },
            dataType: "json"
        })
    }
}

function updateSettings() {
    $("#submit-button").text("Saving...");
    var forms = $(".needs-validation");
    var imageData = "";
    if (testImage.src) {
        var canvas = document.createElement('canvas');
        canvas.width = testImage.width;
        canvas.height = testImage.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(testImage, 0, 0);
        var min = Math.min(canvas.width, canvas.height);
        var ratio = 100/min;
        ctx.scale(ratio, ratio);
        imageData = canvas.toDataURL("image/jpg");
    }
    Array.prototype.filter.call(forms, function (form) {
        if ($(form).hasClass('was-validated')) {
            $.ajax({
                type: "POST",
                url: "../settingsUpdate/",
                data: {
                    display_name: $("#display-name").val(),
                    image: imageData
                },
                success: function (res) {
                    var status = res.status;
                    if (status === "success") {
                        window.location.reload(true);
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
    });
    return false;
}
