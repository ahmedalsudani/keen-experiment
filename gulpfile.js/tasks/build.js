var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var envify = require('envify');
var gulp  = require('gulp');
var server = require('../../server');
var source = require('vinyl-source-stream');
var $ = require('gulp-load-plugins')({
  lazy: false,
  pattern: ['gulp.*', 'gulp-*', 'del']
});

require('dotenv').load();
$.livereload();
$.livereload.listen();

var APP_ROOT = '../..';

var paths = {
  index: './client/index.html',
  root: './client',
  html: './client/**/*.html',
  scripts: './client/app/**/*.js',
  appJs: './client/app/app.js',
  styles: './client/app/**/*.css',
  destTmp: './.tmp/dest',
  destIndex: './.tmp/dest/index.html',
  destScripts: './.tmp/dest/**/*.js',
  destStyles: './.tmp/dest/**/*.css'
}

var buildPaths = [paths.index, paths.html, paths.styles];
var srcPaths = [paths.index, paths.html, paths.scripts, paths.styles];

gulp.task('dev:build', ['dev:browserify'], startBuild);
gulp.task('default', $.sequence('dev:build', 'server', 'dev:watch'));
gulp.task('server', startServer);
gulp.task('dev:watch', startWatch);
gulp.task('inject', startInject);
gulp.task('dev:browserify', startBrowserify);

function startBrowserify() {
  var b = browserify({
    'entries': paths.appJs,
    'debug': true,
    'transform': envify
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest(paths.destTmp));
}

function startBuild() {
  gulp.src(buildPaths, {'base': './client'})
    .pipe(gulp.dest(paths.destTmp));
  return gulp.start('inject');
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
    .pipe( $.inject( scripts,  {relative:true}) )
    .pipe( $.inject( styles,  {relative:true}) )
    .pipe( gulp.dest( paths.destTmp) );
}
