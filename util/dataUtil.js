const mysql = require('mysql');
const config = require('../config/config');
const axios = require('axios');
const crypto = require('crypto');

const salt = config.password.salt;

/**
 * 初始化数据库连接池
 * @type {Pool}
 */
const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
});

/**
 * 其实我不知道
 * 这一句式什么意思呢？
 * @type {{}}
 */
const dataUtil = exports = module.exports = {};

/**
 * 检查后台账号登陆是否成功
 * property checkLogin is not defined in type(解决这个)
 * @param loginName 用户名
 * @param password 密码
 * @param next 回调方法
 * @returns {Promise<any>}
 */
dataUtil.checkLogin = (loginName, password) => {
    const queryStr = 'select password, role from members where login_name= ?';
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(queryStr, [loginName], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        switch(rows.length){
                            case 0:
                                reject("无此用户")
                                break;
                            case 1:
                                const userRow = rows[0];
                                const sha256 = crypto.createHash("sha256");
                                if(sha256.digest(sha256.digest(password).concat(salt))===userRow.password){
                                    resolve(userRow.role);  //返回角色
                                }
                                else{
                                    reject("密码不正确")
                                }
                                break;
                            default:
                                reject("登录名有重复")  //不应该出现
                        }
                    }
                });
                connection.release();
            }
        })
    })
};


/**
 * 作用暂不明确
 */
dataUtil.checkUserLogin = (username, password) => {
    return new Promise(((resolve, reject) => {
        axios.post(
            config.loginUrl + "/" + username + "/" + password,
            JSON.stringify({})
        ).then((res) => {
            if(res.data.success) {
                resolve(true);
            }else {
                reject();
            }
        }).catch((err) => {
            reject(err);
        })
    }))
};