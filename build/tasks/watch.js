var gulp = require('gulp');
var browserSync = require('browser-sync');
var paths = require('../paths');
var runSequence = require('run-sequence');

function reportChange(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('watch', ['serve'], function () {
    gulp.watch(paths.markup, ['process-markup', browserSync.reload]).on('change', reportChange);
    gulp.watch(paths.typescript, ['transpile-typescript', browserSync.reload]).on('change', reportChange);
    gulp.watch(paths.styles, ['process-styles', browserSync.reload]).on('change', reportChange);
});

gulp.task('default', ['watch']);