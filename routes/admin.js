const express = require('express');
const router = express.Router({});
const auth = require('../util/auth');
const dataUtil = require('../util/dataUtil');
const bodyParser = require('body-parser');
const resultWrapper = require("../util/resultWrapper")
const errorCode = require("../util/enums").errorCode

const getToken = auth.getToken;

module.exports = router;

/**
 * admin用户登陆
 * 如果将数据层改到java端，则需要修改
 */
router.use('/login', bodyParser.json());
router.use('/login', bodyParser.urlencoded({extended: true}));
router.post('/login', async (req, res, next) => {
    const {loginName,password} = req.body;
    if (!!!loginName || !!!password) {
        res.statusCode = 400;
        res.json(resultWrapper.wrap(errorCode.invalidArgument))
        return;
    } else {
        dataUtil.checkLogin(loginName, password).then(role=>{
            req.auth = {
                account: req.body.loginName,
                auth: role,
            };
            getToken(req, res, next);
            if(role!==undefined){
                //TODO 修改权限
                res.json(resultWrapper.wrapSuccess());
            }
        })
        .catch(e=>{
            res.json(resultWrapper.wrap(errorCode.invalidPassword,e));
        })
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