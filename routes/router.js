const express = require('express');

const customer = require('./customer');
const admin = require('./admin');

const router = express.Router({});

exports = module.exports = router;

router.use('/customer', customer);

//处理登录、注销
router.use('', admin);
