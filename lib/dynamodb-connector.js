'use strict';

var assert = require('assert-plus');
var uuid = require('uuid');
var AWS = require('aws-sdk');
var dynamoDb = new AWS.DynamoDB.DocumentClient();

function DynamoDBConnector () {}

DynamoDBConnector.prototype.createIdentityValidation = function (validationData, callback) {
    assert.object(validationData);
    assert.string(validationData.customer_id);
    assert.string(validationData.username);
    assert.string(validationData.email_address);
    assert.string(validationData.phone_number);
    assert.string(validationData.validation_status);
    assert.func(callback);

    var params = {
        TableName: 'IdentityValidationsTable',
        Item: {
            id: uuid.v1(),
            customer_id: validationData.customer_id,
            username: validationData.username,
            email_address: validationData.email_address,
            phone_number: validationData.phone_number,
            validation_status: 'PENDING'
        }
    };

    dynamoDb.put(params, function (err) {
        if (err) {
            return callback(err);
        }

        callback(null, params.Item);
    });
};

DynamoDBConnector.prototype.getIdentityValidationById = function (validationData, callback) {
    assert.object(validationData);
    assert.string(validationData.id);
    assert.string(validationData.customer_id);
    assert.func(callback);

    var params = {
        TableName: 'IdentityValidationsTable',
        Key: {
            id: validationData.id,
            customer_id: validationData.customer_id
        }
    };

    dynamoDb.get(params, function (err, validation) {
        if (err) {
            return callback(err);
        }

        callback(null, validation.Item);
    });
};

DynamoDBConnector.prototype.getIdentityValidationsByCustomer = function (validationData, callback) {
    assert.object(validationData);
    assert.string(validationData.customer_id);
    assert.func(callback);

    var params = {
        TableName: 'IdentityValidationsTable'
    };

    dynamoDb.scan(params, function (err, validation) {
        if (err) {
            return callback(err);
        }

        callback(null, validation.Items);
    });
};

DynamoDBConnector.prototype.updateValidationToCompleted = function (validationData, callback) {
    assert.object(validationData);
    assert.string(validationData.id);
    assert.string(validationData.customer_id);
    assert.func(callback);

    var params = {
        TableName: 'IdentityValidationsTable',
        Key: {
            id: validationData.id,
            customer_id: validationData.customer_id
        },
        ExpressionAttributeValues: {
            ':status': 'COMPLETED'
        },
        UpdateExpression: 'SET validation_status = :status',
        ReturnValues: 'ALL_NEW'
    };

    dynamoDb.update(params, function (err, validation) {
        if (err) {
            return callback(err);
        }

        callback(null, validation.Attributes);
    });
};

DynamoDBConnector.prototype.updateValidationToFailed = function (validationData, callback) {
    assert.object(validationData);
    assert.string(validationData.id);
    assert.string(validationData.customer_id);
    assert.func(callback);

    var params = {
        TableName: 'IdentityValidationsTable',
        Key: {
            id: validationData.id,
            customer_id: validationData.customer_id
        },
        ExpressionAttributeValues: {
            ':status': 'FAILED'
        },
        UpdateExpression: 'SET validation_status = :status',
        ReturnValues: 'ALL_NEW'
    };

    dynamoDb.update(params, function (err, validation) {
        if (err) {
            return callback(err);
        }

        callback(null, validation.Attributes);
    });
};

module.exports = DynamoDBConnector;