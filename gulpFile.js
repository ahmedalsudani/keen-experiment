var gulp  = require('gulp');
var $     = require('gulp-load-plugins')({lazy:false});
var R     = require('ramda');

require('dotenv').load();
$.livereload();
$.livereload.listen();

var paths = {
  index: './client/index.html',
  root: './client',
  html: './client/**/*.html',
  scripts: './client/app/**/*.js',
  styles: './client/app/**/*.css',
  destTmp: './.tmp/dest'
}

var srcPaths = [paths.index, paths.html, paths.scripts, paths.styles];

gulp.task('dev:build', startBuild);
gulp.task('default', $.sequence('dev:build', 'server', 'dev:watch'));
gulp.task('server', startServer);
gulp.task('dev:watch', startWatch);
gulp.task('inject', startInject);
gulp.task('dotenv', printEnv);

function startBuild() {
  gulp.src(srcPaths, {'base': './client'})
  .pipe($.iife())
  .pipe(gulp.dest(paths.destTmp));
  return startInject();
}

function printEnv() {
  console.log(process.env['KEEN_PROJECT_ID']);
}

function startServer(){
  require('./server');
}

function startWatch(){
  gulp.watch(srcPaths, function (changedFiles) {
    startBuild();
    $.livereload.changed(changedFiles);
  });
}

function startInject(){
  var target  = gulp.src( paths.index );
  var scripts = gulp.src( paths.scripts, {read:false} );
  var styles  = gulp.src( paths.styles, {read:false} );

  return target
    .pipe( $.inject( scripts,  {relative:true}) )
    .pipe( $.inject( styles,  {relative:true}) )
    .pipe( gulp.dest( paths.destTmp) );
}
