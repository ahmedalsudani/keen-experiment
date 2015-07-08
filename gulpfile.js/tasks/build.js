var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var envify = require('envify');
var gulp  = require('gulp');
var server = require('../../server');
var source = require('vinyl-source-stream');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')({
  lazy: false,
  pattern: ['gulp.*', 'gulp-*', 'del']
});

require('dotenv').load();

var APP_ROOT = '../..';

var paths = {
  bower: './bower_components/**/*',
  index: './client/index.html',
  root: './client',
  html: './client/**/*.html',
  scripts: './client/app/**/*.js',
  appJs: './client/app/app.js',
  styles: './client/app/**/*.css',
  destTmp: './.tmp/dest',
  destBuild: './.tmp/dest/app',
  destIndex: './.tmp/dest/index.html',
  destScripts: './.tmp/dest/app/**/*.js',
  destStyles: './.tmp/dest/app/**/*.css'
}

var copyPaths = [paths.bower];
var buildPaths = [paths.html, paths.styles];
var srcPaths = [paths.index, paths.html, paths.scripts, paths.styles];

gulp.task('dev:build', ['dev:browserify'], startBuild);
gulp.task('default', $.sequence('dev:build', 'inject', 'server', 'dev:livereload'));
gulp.task('server', startServer);
gulp.task('dev:watch', startWatch);
gulp.task('inject', startInject);
gulp.task('dev:browserify', startBrowserify);
gulp.task('dev:livereload', startLiveReload)

function startLiveReload() {
  $.livereload();
  $.livereload.listen();
  gulp.start('dev:watch');
}

function startBrowserify() {
  var b = browserify({
    'entries': paths.appJs,
    'debug': true,
    'transform': envify
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest(paths.destBuild));
}

function startBuild() {
  gulp.src(copyPaths, {'base': './'})
    .pipe(gulp.dest(paths.destTmp));
  gulp.src(paths.index)
    .pipe(gulp.dest(paths.destTmp));
  gulp.src(buildPaths, {'base': './client'})
    .pipe(gulp.dest(paths.destBuild));
}

function startServer(){
  server();
}

function startWatch(){
  gulp.watch(srcPaths, function (changedFiles) {
    gulp.start('dev:build');
    $.livereload.changed(changedFiles);
  });
}

function startInject(){
  var index  = gulp.src( paths.destIndex );
  var scripts = gulp.src( paths.destScripts, {read:false} );
  var styles  = gulp.src( paths.destStyles, {read:false} );

  return index
    .pipe($.inject(scripts, {relative:true}))
    .pipe($.inject(styles, {relative:true}))
    .pipe(wiredep())
    .pipe( gulp.dest( paths.destTmp) );
}
