var gm = require('gm').subClass({
    imageMagick: true
  });


function createThumbnail(item, data, cb) {
    gm(data)
      .size(function(err, size) {
        var scalingFactor = Math.min( 100/size.width, 100/size.height);
        var width = scalingFactor * size.width;
        var height = scalingFactor * size.height;
        this.resize(width, height)
            .toBuffer((item.Key).match(/\.([^.]*)$/)[1], cb);
    });
}

module.exports = {
  createThumbnail
};
