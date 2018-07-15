'use strict';

var assert = require('assert-plus');
var AWS = require('aws-sdk');
var rekognition = new AWS.Rekognition();

function RekognitionConnector () {}

RekognitionConnector.prototype.compareFacesInImages = function (imageData, callback) {
    assert.object(imageData);
    assert.number(imageData.similarity_threshold);
    assert.string(imageData.source_bucket_name);
    assert.string(imageData.source_file_path);
    assert.string(imageData.destination_bucket_name);
    assert.string(imageData.destination_file_path);
    assert.func(callback);

    var params = {
        SimilarityThreshold: imageData.similarity_threshold,
        SourceImage: {
            S3Object: {
                Bucket: imageData.source_bucket_name,
                Name: imageData.source_file_path
            }
        },
        TargetImage: {
            S3Object: {
                Bucket: imageData.destination_bucket_name,
                Name: imageData.destination_file_path
            }
        }
    };

    console.log(params);

    rekognition.compareFaces(params, function (err, data) {
        if (err) {
            return callback(err);
        }

        if (data.FaceMatches.length === 0) {
            return callback(null, { verification_result: 0 });
        }

        callback(null, { verification_result: data.FaceMatches[0].Similarity });
    });
};

RekognitionConnector.prototype.detectNameInKtpImages = function (imageData, callback) {
    assert.object(imageData);
    assert.string(imageData.source_bucket_name);
    assert.string(imageData.source_file_path);
    assert.func(callback);

    const self = this;

    this.detectTextInImages(imageData, function (err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, {
            name: self.getNameFromDetectedText(result)
        });
    });
};

RekognitionConnector.prototype.detectTextInImages = function (imageData, callback) {
    assert.object(imageData);
    assert.string(imageData.source_bucket_name);
    assert.string(imageData.source_file_path);
    assert.func(callback);

    var params = {
        Image: {
            S3Object: {
                Bucket: imageData.source_bucket_name,
                Name: imageData.source_file_path
            }
        }
    };

    rekognition.detectText(params, function (err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result.TextDetections);
    });
};

RekognitionConnector.prototype.getNameFromDetectedText = function (rekognitionDetectTextResult) {
    let name;

    for (var iterator in rekognitionDetectTextResult) {
        var detectedText = rekognitionDetectTextResult[iterator].DetectedText.toUpperCase();
        if (detectedText.indexOf('NAMA') > -1) {
            name = rekognitionDetectTextResult[iterator].DetectedText.replace(' ', '').split(':')[1];
        }

        if (name) {
            break;
        }
    }

    return name;
};

module.exports = RekognitionConnector;