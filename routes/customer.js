const express = require('express');
const router = express.Router({});
const auth = require('../util/auth');

const getToken = auth.getToken;

module.exports = router;

/**
 * 客户登入
 */
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

/**
 * 客户登出
 */
router.use('/logout', (req, res, next) => {
    res.clearCookie('token');
    res.json({
        success: true
    });
    next();
});