'use strict';

var _ = require('ls-lodash'),
    path = require('path'),
    gulp = require('gulp'),
    lsGulpTasks = require('lvsf-gulp-tasks'),

    pkgJson = require('./package'),
    testDirsToLint = ['test/**/*.js'],
    dirsToLint = ['lib/**/*.js', 'gulpfile.js'];

// Multitasks
gulp.task('default', ['test']);

gulp.task('test', ['lint', 'stylecheck', 'mocha']);

// Standard Tasks
gulp.task('lint', lsGulpTasks.lint(dirsToLint, testDirsToLint));

gulp.task('stylecheck', lsGulpTasks.checkstyle(dirsToLint.concat(testDirsToLint)));

gulp.task('mocha', ['lint', 'stylecheck'], lsGulpTasks.mocha(['test/**/*.test.js']));

// Project-specific tasks
