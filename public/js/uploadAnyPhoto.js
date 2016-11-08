$(document).ready(function($) {
    $("input#photo").bind('change', function( evt ){

        var files = evt.target.files; // FileList object
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }


            var reader = new FileReader();
            reader.readAsDataURL(f);
            reader.onload = function () {
                saveImage(reader.result, function() {
                    window.location.href="/user/uploadAnyPhotoComplete";
                })
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    });
});


function saveImage(base64Img, callback) {
    $.ajax({
        type: "POST",
        url: "/user/profileWithBadge",
        data: {base64: base64Img}
    }).done(callback)
}
