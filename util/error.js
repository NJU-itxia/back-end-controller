const error = exports = module.exports = {};

/**
 * 四个参数在express中是错误处理方法
 * @param err
 * @param req
 * @param res
 * @param next
 */
error.appError = (err, req, res, next) => {
    res.json({
        success: false,
        error: err.message
    });
    next();
};
