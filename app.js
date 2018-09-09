const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const proxyMiddleWare = require('http-proxy-middleware');

const auth = require('./util/auth');
const router = require('./routes/router');
const error = require('./util/error');

const getToken = auth.getToken;
const checkToken = auth.checkToken;
const authCheck = auth.authCheck;

const app = express();
const proxyPath = 'http://localhost:8080';
const proxyOption = {target: proxyPath, changeOrigin: true};

const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
};

app.use(bodyParser.json()); // for parsing application/json
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', checkToken);
app.use('/', authCheck);
app.use('/', router);
app.use('/customer', proxyMiddleWare(proxyOption));
app.use(error.appError);

module.exports = app;
