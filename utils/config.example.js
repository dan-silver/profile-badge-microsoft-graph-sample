/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

module.exports = {
    prodCreds: {
        redirectUrl: 'https://localhost:8443/token',
        clientID: '',
        clientSecret: '',
        identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
        skipUserProfile: true,
        responseType: 'code',
        validateIssuer: true,
        issuer: "microsoft.com",
        responseMode: 'query',
        scope: ['User.ReadWrite', 'Profile', 'People.Read', 'Mail.Send'],
        loggingLevel: 'info'
    },
    devCreds: {
        redirectUrl: 'https://localhost:8443/token',
        clientID: '',
        clientSecret: '',
        identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
        skipUserProfile: true,
        responseType: 'code',
        validateIssuer: true,
        issuer: "microsoft.com",
        responseMode: 'query',
        scope: ['User.ReadWrite', 'Profile', 'People.Read', 'Mail.Send'],
        loggingLevel: 'info'
    },
};