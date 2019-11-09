/**
 * 枚举各种值.
 * (主要来自数据库)
 */

module.exports = enums = {
  role: {
    visitor: 0,
    member: 1,
    admin: 2
  },
  errorCode: {
    success: {
      errorCode: 0,
      errorMessage: "请求成功"
    },
    invalidPassword: {
      errorCode: 9,
      errorMessage: "密码不正确"
    }
  }
};
