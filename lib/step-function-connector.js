'use strict';

var assert = require('assert-plus');
var AWS = require('aws-sdk');
var stepFunction = new AWS.StepFunctions();

function StepFunctionConnector () {}

StepFunctionConnector.prototype.callStepFunctions = function (stepFunctionData, callback) {
    assert.object(stepFunctionData);
    assert.string(stepFunctionData.state_machine_arn);
    assert.object(stepFunctionData.input);
    assert.func(callback);

    var params = {
        stateMachineArn: stepFunctionData.state_machine_arn,
        input: JSON.stringify(stepFunctionData.input)
    };

    stepFunction.startExecution(params, function (err) {
        if (err) {
            return callback(err);
        }

        callback(null);
    });
};

module.exports = StepFunctionConnector;