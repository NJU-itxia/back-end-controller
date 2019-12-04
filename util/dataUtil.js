const mysql = require('mysql');
const config = require('../config/config');
const axios = require('axios');

/**
 * 初始化数据库连接池
 * @type {Pool}
 */
const pool = mysql.createPool(config.db);

/**
 * 其实我不知道
 * 这一句式什么意思呢？
 * @type {{}}
 */
const dataUtil = exports = module.exports = {};

/**
 * 检查后台账号登陆是否成功
 * property checkLogin is not defined in type(解决这个)
 * @param username 用户名
 * @param password 密码
 * @param next 回调方法
 * @returns {Promise<any>}
 */
dataUtil.checkLogin = (username, password) => {
    const queryStr = 'select account, password, admin from members where account= ?';
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(queryStr, [username], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        let result;
                        if (rows && rows[0] && rows[0].password && rows[0].password === password) {
                            const row = rows[0];
                            result = row.admin ? 'admin' : 'knight';
                        }
                        resolve(result);
                    }
                });
                connection.release();
            }
        })
    })
};

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