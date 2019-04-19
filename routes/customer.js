const express = require('express');
const router = express.Router({});
const auth = require('../util/auth');
const dataUtil = require('../util/dataUtil');
const bodyParser = require('body-parser');

const getToken = auth.getToken;

module.exports = router;

/**
 * 客户登入，只需要一个phone就可以登陆
 * 添加验证码后需要修改
 */
router.use('/verify', bodyParser.json());
router.use('/verify', bodyParser.urlencoded({extended: true}));
router.use('/verify', (req, res, next) => {
    const phone = req.body.phone;
    const code = req.body.code;
    // const result = await dataUtil.checkUserLogin(phone, code);
    if (result) {
        req.auth = {
            account: req.body.phone,
            auth: 'customer'
        };
        getToken(req, res, next);
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        })
    }
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