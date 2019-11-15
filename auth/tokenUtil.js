const jwt = require("jsonwebtoken");
const config = require("../config/config");

const secret = config.jwt.secret;
/**
 * @param data token数据
 * @param expireTime 过期时间(秒)
 * @returns 加密的token
 */
function generateToken(data, expireTime) {
  return jwt.sign(data, secret, {
    expiresIn: Number(expireTime)
  });
}

/**
 * @param token 要验证的token
 * @returns 解密的token数据
 */
function verifyToken(token) {
  return jwt.verify(token, secret);
}

exports = module.exports = { generateToken, verifyToken };
