var browserSync = require('browser-sync')
var gulp = require('gulp');
var paths = require('../paths');

// this task utilizes the browsersync plugin to create a dev server instance at http://localhost:9000
gulp.task('serve', ['build'], function (done) {
    browserSync({
      online: false,
      open: false,
      port: 9000,
      logLevel: 'silent',
      server: {
        baseDir: ['.'],
        middleware: function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }
      }
    }, done);
});