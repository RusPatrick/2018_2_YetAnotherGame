'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();
const proxy = require('express-http-proxy');
app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());

const port = process.env.PORT || 3000;
//  app.use('*', proxy('https://lolkek-tssjobwzfy.now.sh/', {
//     proxyReqPathResolver: function (req) {
//         return req.originalUrl;
//    }}));
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});


