var orignalName;

$(document).ready(function () {

    orignalName = $('#display-name').val();
    console.log(orignalName);

    $('#display-name').change(updateDisplayName);
    updateDisplayName();
});

function updateDisplayName() {
    var curName = $('#display-name').val();
    if (curName === orignalName) {
        $('#display-name').addClass("is-valid").removeClass("is-invalid");
        $('#display-name-feedback').addClass("valid-feedback").removeClass("invalid-feedback").text("Looks good!");
    } else if (curName.match(" ") != null) {
        $('#display-name').removeClass("is-valid").addClass("is-invalid");
        $('#display-name-feedback').removeClass("valid-feedback").addClass("invalid-feedback").text("You cannot have spaces in your display name.");
    } else {
            $.ajax({
            type: "POST",
            url: "../displayNameVerify/",
            data: {"name": $('#display-name').val()},
            success: function (res) {
                console.log(res.taken);
                if (res.taken) {
                    $('#display-name').removeClass("is-valid").addClass("is-invalid");
                    $('#display-name-feedback').removeClass("valid-feedback").addClass("invalid-feedback").text("That display name is already taken.");
                } else {
                    $('#display-name').addClass("is-valid").removeClass("is-invalid");
                    $('#display-name-feedback').addClass("valid-feedback").removeClass("invalid-feedback").text("Looks good!");
                }
            },
            dataType: "json"
        })
    };
};