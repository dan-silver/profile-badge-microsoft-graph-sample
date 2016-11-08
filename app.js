'use strict';

/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/*
 * This sample uses an open source OAuth 2.0 library that is compatible with the Azure AD v2.0 endpoint.
 * Microsoft does not provide fixes or direct support for this library.
 * Refer to the library’s repository to file issues or for other support.
 * For more information about auth libraries see: 
 * https://azure.microsoft.com/documentation/articles/active-directory-v2-libraries/
 * Library repo:  https://github.com/jaredhanson/passport
 */

const express = require('express');
const session = require('express-session');
const port = process.env.PORT || 8443;
const fs = require('fs');
const https = require('https');
const uuid = require('uuid');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const emailHelper = require('./utils/emailHelper.js');
const config = require('./utils/config.js');
const userRoutes = require('./userRoutes');


const certConfig = {
	key: fs.readFileSync('./utils/cert/server.key', 'utf8'),
	cert: fs.readFileSync('./utils/cert/server.crt', 'utf8')
};

const app = express();
const server = https.createServer(certConfig, app);


app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// authentication =================================================================
var callback = (iss, sub, profile, accessToken, refreshToken, done) => {
	done(null, {
		profile,
		accessToken,
		refreshToken
	})
};

const creds = process.env.PRODUCTION ? config.prodCreds : config.devCreds;

passport.use(new OIDCStrategy(creds, callback));

const users = {};
passport.serializeUser((user, done) => {
    const id = uuid.v4();
    users[id] = user;
    done(null, id);
});

passport.deserializeUser((id, done) => {
    const user = users[id];
    done(null, user)
});

// configuration ===============================================================					
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(methodOverride());
app.set('view engine', 'jade');
app.use(cookieParser());

const LOGIN_TO_REVERT_PHOTO = "login-to-revert-photo";

app.use(session({
	secret: 'sshhhhh',
	name: 'graphNodeCookie',
	resave: false,
	saveUninitialized: false,
	cookie: {secure: true}
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	if (req.user) {
		res.redirect('/app');
	} else {
		res.render('login');
	}
});

app.get('/app', ensureAuthenticated, (req, res) => {
	res.render('app', { user: req.user.profile});
})

// start
app.get('/login', passport.authenticate('azuread-openidconnect', {failureRedirect: '/' }), (req, res) => {
	res.redirect('/');
});

app.get('/login-to-revert-photo', passport.authenticate('azuread-openidconnect', {customState: LOGIN_TO_REVERT_PHOTO, failureRedirect: '/' }), (req, res) => {
	res.redirect('/')
})

// auth redirect callback
app.get('/token', passport.authenticate('azuread-openidconnect', { failureRedirect: '/#loginFailure11' }), (req, res) => {
	if (req.query.state === LOGIN_TO_REVERT_PHOTO) {
		res.redirect('/user/uploadAnyPhoto');
	} else {
		res.redirect('/app');
	}
});


app.use('/user', ensureAuthenticated, userRoutes);

app.get('/logout', (req, res) => {
  req.session.destroy( (err) => {
    req.logOut();
	res.clearCookie('graphNodeCookie');
	res.redirect('/');
  });
});

server.listen(port);
console.log("Server up port " + port);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }

    res.redirect('/');
};


function renderError (res, e) {
	res.render('error', {
		message: e.message,
		error: e
	});
	console.error(e);
};