'use strict';

const graph = require('msgraph-sdk-javascript');

module.exports.init = ((accessToken) => {
    return graph.init({
        defaultVersion: 'v1.0',
        debugLogging: true,
        authProvider: function (done) {
            done(null, accessToken);
        }
    });
});