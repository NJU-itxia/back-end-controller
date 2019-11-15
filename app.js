const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const proxyMiddleWare = require('http-proxy-middleware');

const auth = require('./util/auth');
const router = require('./routes/router');
const error = require('./util/error');
const config = require('./config/config');
const tokenUtil = require('./auth/tokenUtil');

const getToken = auth.getToken;
const checkToken = auth.checkToken;
const authCheck = auth.authCheck;

const app = express();

app.use(function (req, res, next) {
    console.log(req.method + ":" + req.url);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    //处理OPTIONS请求
    if(req.method==="OPTIONS"){
        res.send();
    }
    else{
        next();
    }
});
app.use(logger('dev'));
// app.use(express.json());
app.use(cookieParser());

app.use("/",(req,res,next)=>{
    const token = req.cookies["itxia-token"];
    if(token){
        const de = tokenUtil.verifyToken(token);
        req.headers["memberID"] = de["id"];
    }else{
        console.log("no token")
    }
    next();
})

app.use('/', checkToken);
app.use('/', authCheck);

// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);

for (let path in config.proxy) {
    if (config.proxy.hasOwnProperty(path)) {
        const proxyPath = config.proxy[path];
        const proxyOption = {target: proxyPath, changeOrigin: true};
        app.use(path, proxyMiddleWare(proxyOption))
    }
}

const restore = function (proxyReq, req, res, options) {
    proxyReq.body = req.body
};


app.use(error.appError);
module.exports = app;
