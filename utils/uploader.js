var multer  = require('multer');
var path = require('path');
var fs = require('fs');

const uuidv4 = require('uuid/v4');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + uuidv4() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(res.end('Only images are allowed'), null);
        }
        cb(null, true);
    }
});

function writeToPipe(fieldName){
    return upload.single(fieldName);
}

function clearPipe(file){
    fs.unlinkSync(file.path);
}

function createReadPipe(file){
    return fs.ReadStream(file.path);
}

module.exports = {
    writeToPipe,
    clearPipe,
    createReadPipe
};
