const fs = require('fs');
const path = require('path');

const file = exports = module.exports = {};

/**
 * 读取json文件
 * @param callback
 */
file.readAuthJson = function (callback) {
    // file path
    const filePath = path.resolve(__dirname, './auth.json');
    fs.readFile(filePath, 'utf-8', callback);
};
