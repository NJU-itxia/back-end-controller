const express = require('express');
const router = express.Router({});
const auth = require('../util/auth');
const dataUtil = require('../util/dataUtil');

const getToken = auth.getToken;

module.exports = router;

router.use('/login', async (req, res, next) => {
    const id = req.body.id;
    const password = req.body.password;
    if (id === undefined || id === '' || password === undefined || password === '') {
        return next(new Error("Wrong Parameter"));
    } else {
        const role = await dataUtil.checkLogin(id, password, (result, role) => {
            if (result) console.log(role);
        });
        req.auth = {
            phone: req.body.id,
            auth: role,
        };
        getToken(req, res, next);
        res.json({
            success: role !== undefined
        });
    }
});

router.use('/logout', (req, res, next) => {
    res.clearCookie('token');
    res.json({
        success: true
    });
});