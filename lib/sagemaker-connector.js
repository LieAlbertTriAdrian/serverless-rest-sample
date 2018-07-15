'use strict';

var assert = require('assert-plus');
var levenshtein = require('fast-levenshtein');
// var AWS = require('aws-sdk');

// const ENDPOINTNAME = 'kmeans-2018-07-07-09-02-25-062';
const THRESHOLD = 8;

function SagemakerConnector () {}

SagemakerConnector.prototype.useModel = function (query, callback) {
    assert.object(query);
    assert.number(query.photo_similarity);
    assert.string(query.ktp_name);
    assert.string(query.email);
    assert.func(callback);
    
    // var params = {
    //     EndpointName: ENDPOINTNAME,
    //     ContentType: 'text/csv',
    //     Body: query
    // };

    var parsedEmail = query.email.match(/^([^@]*)@/)[1];

    var levenstheinDistance = levenshtein.get(parsedEmail, query.ktp_name);

    // sagemakerruntime.invokeEndpoint(params, function (err, data) {
    //     if (err) {
    //       console.log(err, err.stack);
    //       return callback(err); 
    //     }
        
    //     console.log('data', data.Body.toString('utf8'));
    //     return callback(null, data.Body.toString('utf8'));
    // });

    var KTPPNLD = Math.floor(Math.random() * 10) + 3;

    console.log(levenstheinDistance + KTPPNLD - query.photo_similarity);

    if (levenstheinDistance + KTPPNLD - query.photo_similarity > THRESHOLD) {
        return callback(null, { status : 'INVALID' });
    }

    callback(null, { status : 'VALID' });
};

module.exports = SagemakerConnector;