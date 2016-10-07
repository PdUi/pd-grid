// TODO: implement task to minify js/css files and make minification dependent on successful run of tests
var $ = require('gulp-load-plugins')({lazy: true});
var eventStream = require('event-stream');
var gulp = require('gulp');
var paths = require('../paths');
var tsconfig = require('../../tsconfig.json');

var modules = ['none', 'amd', 'umd', 'commonjs', 'systemjs']; //'es6', 'es2015'

modules.forEach(function (moduleType) {
    gulp.task('transpile-typescript-' + moduleType, function () {
        tsconfig.compilerOptions.module = moduleType;
        typescriptCompiler = $.typescript.createProject(tsconfig.compilerOptions, { typescript: require('typescript') });

        let dts = gulp.src(paths.typings);
        let src = gulp.src(paths.typescript);

        return eventStream.merge(dts, src)
                        .pipe($.plumber({ errorHandler: $.notify.onError('Error: <%= error.message %>') }))
                        .pipe($.sourcemaps.init())
                        .pipe($.typescript(typescriptCompiler))
                        .pipe($.sourcemaps.write(`./maps`))
                        .pipe(gulp.dest(`${paths.jsOutput}/${moduleType}`));
    });
});
