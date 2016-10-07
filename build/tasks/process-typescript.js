var $ = require('gulp-load-plugins')({lazy: true});
var eventStream = require('event-stream');
var gulp = require('gulp');
var paths = require('../paths');
var typescriptCompiler = typescriptCompiler || null;
var tsconfig = require('../../tsconfig.json');

gulp.task('lint-typescript', function() {
    return gulp.src(paths.typescript)
               .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
               .pipe($.tslint({ configuration: './tslint.json', formatter: 'verbose' }))
               .pipe($.tslint.report());
});

gulp.task('transpile-typescript', ['lint-typescript'], function() {
    if(!typescriptCompiler) {
        typescriptCompiler = $.typescript.createProject(tsconfig.compilerOptions, { typescript: require('typescript') });
    }

    let dts = gulp.src(paths.typings);
    let src = gulp.src(paths.typescript);

    return eventStream.merge(dts, src)
                      .pipe($.plumber({ errorHandler: $.notify.onError('Error: <%= error.message %>') }))
                      .pipe($.sourcemaps.init())
                      .pipe($.typescript(typescriptCompiler))
                      .pipe($.sourcemaps.write('./maps'))
                      .pipe(gulp.dest(paths.jsOutput));
});

gulp.task('copy-typings', function() {
    gulp.src(paths.typingsInternal)
        .pipe(gulp.dest(paths.typingsOutput));
});

gulp.task('process-typescript', ['transpile-typescript', 'copy-typings']);