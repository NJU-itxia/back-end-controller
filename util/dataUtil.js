const mysql = require('mysql');
const config = require('../config/config');

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
});

const dataUtil = exports = module.exports = {};

dataUtil.checkLogin = (username, password, next) => {
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