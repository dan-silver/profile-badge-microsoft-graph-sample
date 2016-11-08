'use strict';

var graphClient = require('./client');



module.exports.list = (accessToken, callback) => {
    let client = graphClient.init(accessToken);
    client
        .api('/me/people')
        .version("beta")
        .get((err, coworkers) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, coworkers);
    });
}