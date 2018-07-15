'use strict';

module.exports = function (grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-eslint');

    // Options
    return {
        eslint: {
            src: [
                './lib/**/*.js',
                'handler.js'
            ],
            options: {
                fix: true
            }
        }
    };
};
