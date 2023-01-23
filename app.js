const express = require('express');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const urlRouter = require('./routes/url');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'hbs');

require("./database/connect.js")(app, process.env.DB_CONN);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cross-origin resource sharing
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
    next();
});

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/shortener', urlRouter);

module.exports = app;
