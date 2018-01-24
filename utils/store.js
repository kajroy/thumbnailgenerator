var AWS = require('aws-sdk');
var config = require('../aws-config.json');
var _ = require('lodash');

// Set the region 
AWS.config.update({
    region: config.aws_region,
    credentials: {
        accessKeyId: config.aws_access_key_id,
        secretAccessKey: config.aws_secret_access_key
    }
  });

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

function listAllItems(item, allKeys, token, cb) {
    var opts = {
        Bucket: config.s3bucket,
        Prefix : config[`${item}Folder`]
    };
    if(token) {
        opts.ContinuationToken = token;
    }
    s3.listObjectsV2(opts, function(err, data){
        if(data === null){
            _.remove(allKeys, function(photo){
                return photo.Key === opts.Prefix;
            });
            cb(err, allKeys);
        }  else {
            allKeys = allKeys.concat(data.Contents);
            if(data.IsTruncated) {
                listAllKeys(allKeys, data.NextContinuationToken, cb);
            } else {
                _.remove(allKeys, function(photo){
                    return photo.Key === opts.Prefix;
                });
                cb(err, allKeys);
            }
        }
    });
}

function displayOptions(){
    return opts = {
        Bucket: config.s3bucket,
        Prefix: config.displayFolder
    }
}

function getItem(item, cb) {
    var opts = {
        Bucket: config.s3bucket,
        Key: item.Key
    };
    s3.getObject(opts, cb);
}

function putItem(item, contentType, data, cb) {
    var opts = {
        Bucket: config.s3bucket,
        Key: item.Key.replace(config.originalFolder, config.displayFolder),
        Body: data,
        ContentType: contentType,
        ACL: 'public-read'
    };
    s3.putObject(opts, cb);
}

function putItemStream(item, streamData, cb) {
    var opts = {
        Bucket: config.s3bucket,
        Key: `${config.originalFolder}${item.filename}`,
        Body: streamData,
        ContentType: item.mimetype
    };
    s3.upload(opts, cb);
}

function copyItem(item, cb) {
    var opts = {
        Bucket: config.s3bucket,
        CopySource: `${config.s3bucket}/${item.Key}`,
        Key: item.Key.replace(config.originalFolder, config.backupFolder)
    };
    s3.copyObject(opts, cb);
}

function deleteItem(item, cb) {
    var opts = {
        Bucket: config.s3bucket,
        Key: item.Key
    };
    s3.deleteObject(opts, cb);
}

module.exports = {
    listAllItems,
    displayOptions,
    getItem,
    putItem,
    putItemStream,
    copyItem,
    deleteItem
};
