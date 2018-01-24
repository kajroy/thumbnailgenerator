var express = require('express');
var router = express.Router();

var store = require('../utils/store');
var uploader = require('../utils/uploader');

/* GET home page. */
router.get('/', function(req, res, next) {

  store.listAllItems('display', [], null, function(err, data) {
    if (err) {
      res.render('error', { error: err });
    } else {
      res.render('index', { title: 'Thumbnail View Generator', photos: data, options: store.displayOptions()});
    }
  });
});

router.post('/upload', uploader.writeToPipe('photo'), function(req, res, next) {
  var file = req.file;
  var fileStream = uploader.createReadPipe(file);
  store.putItemStream(file, fileStream, function(err, data) {
    if (err) {
      res.render('error', { error: err });
    } else {
      uploader.clearPipe(file);
      res.redirect('/');
    }
  });
});

module.exports = router;
