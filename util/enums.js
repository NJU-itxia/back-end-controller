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
    invalidArgument: {
      errorCode: 8,
      errorMessage: "参数名不正确"
    },
    invalidPassword: {
      errorCode: 9,
      errorMessage: "账号或密码不正确"
    }
  }
};
