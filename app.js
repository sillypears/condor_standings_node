var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');

var app = express();

const indexRouter = require('./routes/index');
const api = require('./routes/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/', indexRouter);
app.get('/api', api.api);
app.get('/api/event', api.events);
app.get('/api/event/:event', api.event);
app.get('/api/teamresults', api.teamresults);
app.get('/api/s', api.s);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
