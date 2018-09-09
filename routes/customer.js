const express = require('express');
const router = express.Router({});
const auth = require('../util/auth');

const getToken = auth.getToken;

module.exports = router;

router.use('/login', (req, res, next) => {
    req.auth = {
        phone: req.body.phone,
        auth: 'customer'
    };
    getToken(req, res, next);
    res.json({
        success: true
    });
});

router.use('/logout', (req, res, next) => {
    res.clearCookie('token');
    res.json({
        success: true
    });
    next();
});