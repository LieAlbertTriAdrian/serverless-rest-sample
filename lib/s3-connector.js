'use strict';

var assert = require('assert-plus');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

function S3Connector () {}

S3Connector.prototype.uploadImage = function (imageData, callback) {
    assert.object(imageData);
    assert.string(imageData.content);
    assert.string(imageData.bucket_name);
    assert.string(imageData.image_type);
    assert.string(imageData.file_name);
    assert.func(callback);

    var decodedImage = Buffer.from(imageData.content, 'base64');
    var filePath = `${imageData.image_type}_${imageData.file_name}.jpg`; 

    var params = {
        'Body': decodedImage,
        'Bucket': imageData.bucket_name,
        'Key': filePath
    };

    s3.upload(params, function (err, data) {
        if (err) {
            return callback(err);
        }

        var response = {
            status_code: 200,
            body: JSON.stringify(data)
        };

        callback(null, response);
    });
};
    
module.exports = S3Connector;