const express = require('express');
const router = express.Router({});
const auth = require('../util/auth');
const dataUtil = require('../util/dataUtil');
const bodyParser = require('body-parser');
const resultWrapper = require("../util/resultWrapper")

const getToken = auth.getToken;

module.exports = router;

/**
 * admin用户登陆
 * 如果将数据层改到java端，则需要修改
 */
router.use('/login', bodyParser.json());
router.use('/login', bodyParser.urlencoded({extended: true}));
router.post('/login', async (req, res, next) => {
    const loginName = req.body.loginName;
    const password = req.body.password;
    console.log(`on /login:${loginName},${password}`)
    if (loginName === undefined || loginName === '' || password === undefined || password === '') {
        return next(new Error("Wrong Parameter"));
    } else {
        const role = await dataUtil.checkLogin(loginName, password);
        req.auth = {
            account: req.body.loginName,
            auth: role,
        };
        getToken(req, res, next);
        if(role!==undefined){
            //TODO 修改权限
            res.json(resultWrapper.wrapSuccess())
        }
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