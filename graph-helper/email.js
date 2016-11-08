'use strict';

var graphClient = require('./client');

module.exports.sendEmailWithPicture = (accessToken, emailTo, callback) => {
    let client = graphClient.init(accessToken);

    // send an email
    const mail = {
        subject: "You've updated your photo!",
        toRecipients: [{
            emailAddress: {
                address: emailTo
            }
        }],
        body: {
            content: "You've added a badge to your profile picture! Here's a copy of your original picture for when you want to change it back.",
            contentType: "html"
        }
    }

    client
        .api('/users/me/sendMail')
        .post({message: mail},callback);
}