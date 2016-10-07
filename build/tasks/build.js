var del = require('del');
var gulp = require('gulp');
var paths = require('../paths');
var runSequence = require('run-sequence');

gulp.task('clean', function() {
    return del(paths.output);
})

gulp.task('build', function(done) {
    runSequence(
        'clean',
        [
            'modules',
            'process-styles'
        ],
        done
    )
});