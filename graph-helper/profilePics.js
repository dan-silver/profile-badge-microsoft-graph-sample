'use strict';

var graphClient = require('./client');
const fs = require('fs');
var stream = require('stream');
var uuid = require('node-uuid');



module.exports.downloadPicture = (accessToken, callback) => {
    let client = graphClient.init(accessToken);
    client.api('/me/photo/$value').get((err, picture) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, picture);
    });
}

module.exports.downloadPictureStream = (accessToken, callback) => {
    let client = graphClient.init(accessToken);
    client.api('/me/photo/$value').getStream((err, stream) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, stream);
    });
}

module.exports.updateWithBase64 = (accessToken, base64Img, callback) => {
    let guid = uuid.v4();

    var base64Img = base64Img.replace(/^data:image\/png;base64,/, "");
    base64Img = base64Img.replace(/^data:image\/jpeg;base64,/, "");

    require("fs").writeFile(`userPictures/${guid}.jpg`, base64Img, 'base64', function(err) {
        console.log(err);
        let profilePhotoReadStream = fs.createReadStream(`userPictures/${guid}.jpg`);

        let client = graphClient.init(accessToken);
        client
            .api('/me/photo/$value')
            .put(profilePhotoReadStream, (err) => {
                if (err) {
                    callback(err);
                    return;
                }
                callback();
            });
    });
}