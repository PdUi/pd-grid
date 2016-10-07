var $ = require('gulp-load-plugins')({lazy: true});
var gulp = require('gulp');
var paths = require('../paths');
var browserSync = require('browser-sync');

gulp.task('lint-styles', function() {
    return gulp.src(paths.styles)
               .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
               .pipe($.sassLint({configFile: './sasslint.yml'}))
               .pipe($.sassLint.format());
});

gulp.task('process-styles', ['lint-styles'], function() {
    return gulp.src(paths.styles)
               .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
               .pipe($.changedInPlace({firstPass:true}))
               .pipe($.sourcemaps.init())
               .pipe($.sass())
               .pipe($.sourcemaps.write('./maps'))
               .pipe(gulp.dest(paths.cssOutput));
});