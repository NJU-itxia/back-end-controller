const express = require('express');
const router = express.Router({});
const auth = require('../util/auth');
const dataUtil = require('../util/dataUtil');
const bodyParser = require('body-parser');

const getToken = auth.getToken;

module.exports = router;

/**
 * admin用户登陆
 * 如果将数据层改到java端，则需要修改
 */
router.use('/login', bodyParser.json());
router.use('/login', bodyParser.urlencoded({extended: true}));
router.post('/login', async (req, res, next) => {
    const id = req.body.id;
    const password = req.body.password;
    console.log(id)
    if (id === undefined || id === '' || password === undefined || password === '') {
        return next(new Error("Wrong Parameter"));
    } else {
        const role = await dataUtil.checkLogin(id, password);
        req.auth = {
            account: req.body.id,
            auth: role,
        };
        getToken(req, res, next);
        res.json({
            success: role !== undefined
        });
    }
});

/**
 * 登出，使用token
 * token会在auth.js中使用checkToken方法检查
 */
router.use('/logout', (req, res, next) => {
    res.clearCookie('token');
    res.json({
        success: true
    });
});