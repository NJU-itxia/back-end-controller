const { errorCode } = require("./enums");

module.exports = {
  wrap: function(errorCodeObject, payload) {
    return {
      ...errorCodeObject,
      payload
    };
  },
  wrapSuccess: function(payload) {
    return this.wrap(errorCode.success, payload);
  }
};
