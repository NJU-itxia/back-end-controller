const express = require('express');
const router = express.Router({});
const auth = require('../util/auth');

const getToken = auth.getToken;

module.exports = router;

/**
 * 客户登入，只需要一个phone就可以登陆
 * 添加验证码后需要修改
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
 * 客户登出，
 * 需要登录得到的token
 * (在checkToken中会检查)
 */
router.use('/logout', (req, res, next) => {
    res.clearCookie('token');
    res.json({
        success: true
    });
    next();
});