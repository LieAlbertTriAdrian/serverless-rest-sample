'use strict';

const rekognition = new(require('../lib/rekognition-connector'));

const params = {
    source_bucket_name: 'pearly-gates-images',
    source_file_path: 'KTP-600x416.jpg'
};

function getNameFromDetectedText(rekognitionDetectTextResult) {
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
}

rekognition.detectTextInImages(params, function (err, result) {
    if (err) {
        console.log(err);
    }

    console.log(result);

    console.log('final name: ', getNameFromDetectedText(result.TextDetections));
});