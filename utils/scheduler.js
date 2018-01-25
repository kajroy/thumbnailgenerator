var store = require('./store');
var convertor = require('./convertor');
var _ = require('lodash');
var async = require('async');
var schedule = require('node-schedule');
var isCompleted = true;

var thumbnailGenerator = new schedule.Job(function () {
    isCompleted = false;
    store.listAllItems('original', [], null, function (err, data) {
        if (err) {
            console.error(err);
        } else {
            _.forEach(data, function (photo) {
                async.waterfall([
                    function download(next) {
                        store.getItem(photo, next);
                    },
                    function process(response, next) {
                        convertor.createThumbnail(photo, response.Body,
                            function (err, buffer) {
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
                ], function (err, result) {
                    if (err) {
                        console.error(err);
                    }
                    isCompleted = true;
                });
            });
        }
    });
});

thumbnailGenerator.on('scheduled', function(){
    if(isCompleted === false){
        thumbnailGenerator.cancel();
    }
})

function start(){
    thumbnailGenerator.schedule({
        rule: '*/8 * * * *'
    });
}

module.exports = {
    thumbnailGenerator,
    start
};
