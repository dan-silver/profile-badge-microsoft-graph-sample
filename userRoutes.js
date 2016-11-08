'use strict';

const express = require('express');
let router = express.Router();
const profilePics = require('./graph-helper/profilePics');
const email = require('./graph-helper/email');
const coworkers = require('./graph-helper/coworkers');
const fs = require('fs');

router.get('/photo', function(req, res, next) {
    profilePics.downloadPicture(req.user.accessToken, (err, picture) => {
        if (err) {
            next(err);
            return;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(picture, 'binary');
    })
});

router.get('/sendEmailWithBackupPhoto', function(req, res, next) {
    email.sendEmailWithPicture(req.user.accessToken, "dansil@microsoft.com", (err, emailRes) => {
        if (err) {
            next(err);
            return;
        }
        res.sendStatus(200);
    });
})

router.post('/profileWithBadge', function(req, res, next) {
    let base64Img = req.body.base64;
    // first send the user an email with thier current photo

    profilePics.updateWithBase64(req.user.accessToken, base64Img, (err) => {
        if (err) {
            next(err);
            return;
        }
        res.sendStatus(200);
    });
});

router.get('/uploadAnyPhoto', (req, res) => {
    res.render('uploadAnyPhoto', {user: req.user});
})


router.get('/uploadAnyPhotoComplete', (req, res) => {
    res.render('uploadAnyPhotoComplete', {user: req.user});
})

router.post('/uploadAnyPhoto', (req, res) => {
    let base64Img = req.body.base64;
    profilePics.updateWithBase64(req.user.accessToken, base64Img, (err) => {
        if (err) {
            next(err);
            return;
        }
        res.render('/uploadAnyPhotoComplete', {user: req.user});
    });

})

router.get('/updateComplete', function(req, res) {

    let emailSubject = encodeURIComponent("Add a voting badge to your company picture!")
    let emailBody = encodeURIComponent("Add a voting badge to your company picture!  Check out http://microsoft.com")

    coworkers.list(req.user.accessToken, (err, coworkers) => {
        res.render('updateComplete', {user: req.user, coworkers: coworkers.value, email: {subject: emailSubject, body: emailBody}})
    })
})

module.exports = router;