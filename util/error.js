const error = exports = module.exports = {};

error.appError = (err, req, res, next) => {
    res.json({
        success: false,
        error: err.message
    });
    next();
};
