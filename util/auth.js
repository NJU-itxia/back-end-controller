const jwt = require('jsonwebtoken');
const config = require('../config/config');

const file = require('./file');

const readAuthJson = file.readAuthJson;

/**
 * 啊，js真灵活
 * 把ignoreUrl从完全匹配的模式改为开头匹配
 */
const ignoreUrl = (() => {
    let result = {};
    const urls = [/\/customer\/login/, /\/admin\/login/, /^\/service\/sms/, /\/customer\/verify.*/];
    result.includes = (url) => {
        let isIncluded = false;
        for (let i = 0; i < urls.length; i++) {
            if (url.match(urls[i])) {
                isIncluded = true;
                break;
            }
        }
        return isIncluded;
    };
    return result;
})();

/**
 * 用于检查token
 * 目前的检查方式:
 * 1. 登陆路径跳过，交给后面的方法处理
 * 2. 非登陆路径，检查token是否存在
 *
 * 不需要权限时如何配置呢
 * @param req request
 * @param res response
 * @param next 回调方法
 */
const checkToken = (req, res, next) => {
    if (ignoreUrl.includes(req.url)) {
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

/**
 * 检查权限，目前的方式是逐条对应的
 * 比如一个身份admin有一个完整路径/admin/xxx的权限，则可以访问/admin/xxx
 * 应该改成一个身份admin有此权限时，可以访问/admin/xxx开头的所有路径
 * （上述已修改）
 * 然后auth.json可以修改内容了
 * @param req request
 * @param res response
 * @param next 回调方法
 */
const authCheck = (req, res, next) => {
    // generate authData
    const authData = req.cookies.token;
    // generate url
    const originalUrl = req.originalUrl;
    if (ignoreUrl.includes(originalUrl)) {
        next();
    } else {
        // operate file
        readAuthJson((error, result) => {
            if (error) {
                next(error);
            } else {
                let auth, uid;
                try {
                    let realData = jwt.verify(authData, config.jwt.secret);
                    uid = realData['account'];
                    auth = realData['auth'];  // token expire, authData not have auth's key
                } catch (error) {
                    next(error);
                }
                const allTarget = JSON.parse(result);
                let contains = false;
                allTarget.forEach((res) => {
                    if (res.auth === auth) {
                        for (let i = 0; i < res.url.length; i++) {
                            console.log(originalUrl + "," + res.url[i] + "," + (originalUrl.startsWith(res.url[i])));
                            if (originalUrl.startsWith(res.url[i])) {
                                contains = true;
                                req.headers.id = uid;
                                next();
                            }
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

/**
 * 调用jwt库中的方法获取token
 * 并写入cookie中
 * @param req
 * @param res
 * @param next
 */
const getToken = (req, res, next) => {
    const data = req.auth;
    const token = jwt.sign(data, config.jwt.secret, {
        expiresIn: Number(config.jwt.expires)
    });
    res.cookie('token', token, {
        expires: new Date(Date.now() + Number(config.cookie.expires)*1000),
        domain: config.cookie.domain
    });
    next();
};

exports.checkToken = module.exports.checkToken = checkToken;
exports.authCheck = module.exports.authCheck = authCheck;
exports.getToken = module.exports.getToken = getToken;
