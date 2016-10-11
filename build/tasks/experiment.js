// GOAL: concat -> transpile 'none'
//       prepend (export and import) -> transpile to 'amd', 'umd', 'commonjs', 'systemjs', 'es6', 'es2015'
//       minify js/css

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var eventStream = require('event-stream');
var pump = require('pump');
var paths = require('../paths');
var typescriptConfig = require('../../tsconfig.json');

gulp.task('no-module-js', ['lint-typescript'], function() {
    var typescriptProject = $.typescript.createProject(typescriptConfig.compilerOptions, { typescript: require('typescript') });

    return eventStream.merge(getFileStreams(false))
                      .pipe($.plumber({ errorHandler: $.notify.onError('Error: <%= error.message %>') }))
                      .pipe($.concat('grid.ts'))
                      .pipe($.sourcemaps.init())
                      .pipe($.typescript(typescriptProject))
                      .pipe($.sourcemaps.write('./maps'))
                      .pipe(gulp.dest(paths.jsOutput));
});

function getFileStreams(isModule) {
    // var iLoggerStream = gulp.src(paths.root + 'i-logger.d.ts');
    // if (isModule) {
    //     iLoggerStream = iLoggerStream.pipe($.injectString.prepend('export '));
    // }

    // var iPagerTemplatesStream = gulp.src(paths.root + 'i-pager-templates.d.ts');
    // if (isModule) {
    //     iPagerTemplatesStream = iPagerTemplatesStream.pipe($.injectString.prepend('export '));
    // }

    // var iPagerOptionsStream = gulp.src(paths.root + 'i-pager-options.d.ts');
    // if (isModule) {
    //     iPagerOptionsStream = iPagerOptionsStream.pipe($.injectString.prepend('import {IPagerTemplates} from \'./i-pager-templates\';\n\nexport '));
    // }

    // var pagerTemplateConstantsStream = gulp.src(paths.root + 'pager-templates-constants.ts');
    // if (isModule) {
    //     pagerTemplateConstantsStream = pagerTemplateConstantsStream.pipe($.injectString.prepend('export '));
    // }

    var gridStream = gulp.src(paths.root + 'grid.ts');
    if (isModule) {
        gridStream = gridStream.pipe($.injectString.prepend('export '));
    }

    return [gridStream]; // iLoggerStream, iPagerTemplatesStream, iPagerOptionsStream, pagerTemplateConstantsStream, pagerStream];
}

function prependFilesForModules(moduleType, isEsNextModule) {
    var typescriptProject = createTypescriptProject(moduleType, isEsNextModule);

    return eventStream.merge(getFileStreams(true))
                      .pipe($.plumber({ errorHandler: $.notify.onError('Error: <%= error.message %>') }))
                      .pipe($.sourcemaps.init())
                      .pipe($.typescript(typescriptProject))
                      .pipe($.sourcemaps.write('./maps'))
                      .pipe(gulp.dest(paths.jsOutput + moduleType));
}

function createTypescriptProject(moduleType, isEsNextModule) {
    typescriptConfig.compilerOptions.module = moduleType;
    if(isEsNextModule) {
        typescriptConfig.compilerOptions.target = 'es6';
    }
    return $.typescript.createProject(typescriptConfig.compilerOptions, { typescript: require('typescript') });
}

gulp.task('amd-module-js', ['no-module-js'], function() {
    return prependFilesForModules('amd');
});

gulp.task('umd-module-js', ['no-module-js'], function() {
    return prependFilesForModules('umd');
});

gulp.task('commonjs-module-js', ['no-module-js'], function() {
    return prependFilesForModules('commonjs');
});

gulp.task('system-module-js', ['no-module-js'], function() {
    return prependFilesForModules('system');
});

gulp.task('es6-module-js', ['no-module-js'], function() {
    return prependFilesForModules('es6', true);
});

gulp.task('es2015-module-js', ['no-module-js'], function() {
    return prependFilesForModules('es2015', true);
});

gulp.task('typings', function() {
    return gulp.src(paths.root + '**/*.d.ts')
               .pipe(gulp.dest(paths.jsOutput + 'typings'));
})

gulp.task('modules', ['amd-module-js', 'umd-module-js', 'commonjs-module-js', 'system-module-js', 'es6-module-js', 'es2015-module-js', 'typings'], function(callback) {
    pump([
        gulp.src([paths.output + '**/*.js', '!**/es2015/**/*.js', '!**/es6/**/*.js']),
        $.uglify(),
        $.rename(function (path) {
            path.extname = '.min.js';
        }),
        gulp.dest(paths.output)
    ],
    callback);
});
