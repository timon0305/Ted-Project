const jwt = require('express-jwt');

const getTokenFromHeaders = (req, res) => {
    const {header: { authorization } } = req;

    if (authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

const auth = {
    required: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialRequired: false
    })
};

module.exports = auth;