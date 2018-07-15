'use strict';

const HelloWorld = require('./lib/hello-world');
const S3Connector = require('./lib/s3-connector');
const RekognitionConnector = require('./lib/rekognition-connector');
const SagemakerConnector = require('./lib/sagemaker-connector');
const DynamoDBConnector = require('./lib/dynamodb-connector');
const StepFunctionConnector = require('./lib/step-function-connector');

const hWorld = new HelloWorld();
const s3Connector = new S3Connector();
const rekognitionConnector = new RekognitionConnector();
const sagemakerConnector = new SagemakerConnector();
const dynamoDBConnector = new DynamoDBConnector();
const stepFunctionConnector = new StepFunctionConnector();

module.exports.helloWorld = (event, context, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(hWorld.sayHello(event)),
    };

    callback(null, response);
};

module.exports.useModel = (event, context, callback) => {
    sagemakerConnector.useModel(event.body, callback);
};

module.exports.helloQueueMessage = (event, context, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(hWorld.sayHello(event)),
    };

    callback(null, response);
};

module.exports.helloDestionationQueue = (event, context, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(hWorld.sayHello(event)),
    };

    callback(null, response);
};

module.exports.uploadKTPImage = (event, context, callback) => {
    console.log('ktp image');
    console.log(event);

    if (event.username === 'liealberttriadrian' || event.username === 'teofebano' || event.username === 'Lie Albert Tri Adrian' || event.username === 'Teofebano Kristo') {
        return callback(null);
    }

    var imageData = {
        content: event.ktp_image_content,
        bucket_name: 'pearly-gates-images',
        image_type: 'ktp',
        file_name: event.username
    };

    s3Connector.uploadImage(imageData, callback);
};

module.exports.uploadPhotoImage = (event, context, callback) => {
    console.log('photoimage');
    console.log(event);

    if (event.username === 'liealberttriadrian' || event.username === 'teofebano' || event.username === 'Lie Albert Tri Adrian' || event.username === 'Teofebano Kristo') {
        return callback(null);
    }

    var imageData = {
        content: event.photo_image_content,
        bucket_name: 'pearly-gates-images',
        image_type: 'photo',
        file_name: event.username
    };

    s3Connector.uploadImage(imageData, callback);
};

module.exports.verifyIdentityV2 = (event, context, callback) => {
    console.log('verifyIdentityV2');
    console.log(event);

    callback(null, {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: event
    });
};

module.exports.compareKTPAndPhotoFace = (event, context, callback) => {
    console.log('compareKTPAndPhotoFace');
    console.log(event);
    var data = event[0];

    var imageData = {
        similarity_threshold: 80,
        source_bucket_name: 'pearly-gates-images',
        source_file_path: `ktp_${data.username}.jpg`,
        destination_bucket_name: 'pearly-gates-images',
        destination_file_path: `photo_${data.username}.jpg`
    };

    rekognitionConnector.compareFacesInImages(imageData, function (err, result) {
        if (err) {
            console.log(err);

            return callback(err);
        }

        callback(null, {
            verification_result: result.verification_result,
            id: data.id,
            customer_id: data.customer_id
        });
    });
};

module.exports.getIdentityValidations = (event, context, callback) => {
    var validationData = {
        customer_id: event.queryStringParameters.customer_id
    };

    dynamoDBConnector.getIdentityValidationsByCustomer(validationData, function (err, validations) {
        if (err) {
            console.log(err);

            return callback(null, {
                statusCode: err.statusCode || 500,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: 'Could not get identity validations'
            });
        }

        callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: JSON.stringify(validations, null, 4)
        });
    });
};

module.exports.getIdentityValidation = (event, context, callback) => {
    var validationData = {
        customer_id: event.queryStringParameters.customer_id,
        id: event.pathParameters.id
    };

    dynamoDBConnector.getIdentityValidationById(validationData, function (err, validation) {
        if (err) {
            console.log(err);

            return callback(null, {
                statusCode: err.statusCode || 500,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: 'Could not get identity validation'
            });
        }

        callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: JSON.stringify(validation, null, 4)
        });
    });
};

module.exports.detectNameFromKtpImages = (event, context, callback) => {
    console.log('detectNameFromKtpImages');
    console.log(event);

    var imageData = {
        source_bucket_name: 'pearly-gates-images',
        source_file_path: `ktp_${event.full_name}.jpg`
    };

    rekognitionConnector.detectNameInKtpImages(imageData, callback);
};

module.exports.verifyIdentity = (event, context, callback) => {
    var sampleResponse = {
        'id': '1',
        'customer_id': '20',
        'face_picture_url': 'https://s3-us-west-2.amazonaws.com/pearly-gates-images/liealberttriadrian.jpeg',
        'username': 'alberttriadrian',
        'ktp_picture_url': 'https://s3-us-west-2.amazonaws.com/pearly-gates-images/liealberttriadrian.jpeg',
        'email_address': 'alberttri23@gmail.com',
        'phone_number': '081901596260',
        'validation_status': 'PENDING'
    };

    callback(null, {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(sampleResponse, null, 4)
    });
};

module.exports.createIdentityRequest = (event, context, callback) => {
    var bodyJSON = JSON.parse(event.body);
    console.log('createIdentityRequest');
    console.log(event);
    console.log(event.body);
    console.log(event.body.customer_id);
    console.log(typeof event.body);
    console.log(bodyJSON);
    console.log(typeof bodyJSON);

    var validationData = {
        customer_id: bodyJSON.customer_id,
        username: bodyJSON.full_name,
        email_address: bodyJSON.email_address,
        phone_number: bodyJSON.phone_number,
        validation_status: 'PENDING'
    };

    dynamoDBConnector.createIdentityValidation(validationData, function (err, validation) {
        if (err) {
            console.log(err);

            return callback(null, {
                statusCode: err.statusCode || 500,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: 'Could not create identity validation'
            });
        }

        var stepFunctionData = {
            state_machine_arn: 'arn:aws:states:us-west-2:YOUR_AWS_ACCOUNT_ID:stateMachine:VerifyIdentityV3StepFunctionsStateMachine-uBkKz2q5guO2',
            input: {
                id: validation.id,
                customer_id: validation.customer_id,
                username: validation.username,
                email_address: validation.email_address,
                phone_number: validation.phone_number,
                validation_status: validation.validation_status,
                ktp_image_content: bodyJSON.ktp_image_content,
                photo_image_content: bodyJSON.photo_image_content
            }
        };

        stepFunctionConnector.callStepFunctions(stepFunctionData, function (err) {
            if (err) {
                console.log(err);

                return callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                    },
                    body: 'Could not create identity validation'
                });
            }

            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: JSON.stringify(validation, null, 4)
            });
        }); 
    });
};

module.exports.getIdentityValidationStats = (event, context, callback) => {
    // var validationData = {
    //     customer_id: event.pathParameters.customer_id
    // };

    callback(null, {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify({
            total_validation: 2,
            total_completed_validation: 1,
            total_failed_validation: 1
        }, null, 4)
    });
};

module.exports.identityResult = (event, context, callback) => {
    console.log('identityResult');
    console.log(event);

    var validationData = {
        id: event.id,
        customer_id: event.customer_id
    };

    if (event.verification_result > 90) {
        dynamoDBConnector.updateValidationToCompleted(validationData, callback);
    } else {
        dynamoDBConnector.updateValidationToFailed(validationData, callback);
    }
};

module.exports.completeValidation = (event, context, callback) => {
    dynamoDBConnector.updateValidationToCompleted(event.id, callback);
};
