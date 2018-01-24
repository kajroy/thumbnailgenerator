var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var store = require('./utils/store');
var convertor = require('./utils/convertor');
var _ = require('lodash');
var async = require('async');
var schedule = require('node-schedule');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

schedule.scheduleJob('*/1 * * * *', function(){
  store.listAllItems('original', [], null, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      _.forEach(data, function(photo){
        async.waterfall([
          function download(next) {
            store.getItem(photo, next);
          },
          function process(response, next) {
            convertor.createThumbnail(photo, response.Body,
              function(err, buffer) {
                if (err) {
                  next(err);
                } else {
                  next(null, response.ContentType, buffer);
                }
              }
            );
          },
          function upload(contentType, data, next) {
            store.putItem(photo, contentType, data, next);
          },
          function move2backup(response, next) {
            store.copyItem(photo, next);
          },
          function remove(response, next) {
            store.deleteItem(photo, next);
          }
        ], function(err, result) {
          if (err) {
            console.error(err);
          } else {
            console.log('Done');
          }
        });
      });
    }
  });
});

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
