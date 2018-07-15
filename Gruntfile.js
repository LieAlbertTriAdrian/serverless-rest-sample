'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-bg-shell');

    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    grunt.registerTask('test-style', ['eslint']);
    grunt.registerTask('test', ['test-style']);
};
