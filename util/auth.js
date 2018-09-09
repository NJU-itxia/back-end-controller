const jwt = require('jsonwebtoken');
const config = require('../config/config');

const file = require('./file');

const readAuthJson = file.readAuthJson;

const checkToken = (req, res, next) => {
    if (['/customer/login', '/admin/login'].includes(req.url)) {
        next();
    } else {
        const token = req.cookies.token;
        if (token === undefined) {
            next(new Error('Please Login'));
        } else {
            next();
        }
    }
};

const authCheck = (req, res, next) => {
    // generate authData
    const authData = req.cookies.token;
    // generate url
    const originalUrl = req.originalUrl;
    const loginUrl = [
        '/customer/login',
        '/admin/login'
    ];
    if (loginUrl.includes(originalUrl)) {
        next();
    } else {
        // operate file
        readAuthJson((error, result) => {
            if (error) {
                next(error);
            } else {
                let auth;
                try {
                    auth = jwt.decode(authData)['auth'];  // token expire, authData not have auth's key
                } catch (error) {
                    next(error);
                }
                const allTarget = JSON.parse(result);
                let contains = false;
                allTarget.forEach((res) => {
                    if (res.auth === auth) {
                        if (res.url.includes(originalUrl)) {
                            contains = true;
                            next();
                        }
                    }
                });
                if (!contains) {
                    const authError = new Error('No Auth');
                    next(authError);
                }
            }
        });
    }
};

const getToken = (req, res, next) => {
    const data = req.auth;
    const token = jwt.sign(data, config.jwt.secret, {
        expiresIn: config.jwt.expires
    });
    res.cookie('token', token);
    next();
};

exports.checkToken = module.exports.checkToken = checkToken;
exports.authCheck = module.exports.authCheck = authCheck;
exports.getToken = module.exports.getToken = getToken;
