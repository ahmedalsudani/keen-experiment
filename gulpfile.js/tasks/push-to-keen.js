var fs = require('fs');
var gulp = require('gulp');
var keen = require('keen.io');
var transformCoverage = require('../helpers/transform-coverage');
require('dotenv').load();

var projectName = process.env.PROJECT_NAME;

var keenClient = keen.configure({
  'writeKey': process.env.KEEN_WRITE_KEY,
  'projectId': process.env.KEEN_PROJECT_ID
});

function pushToKeen(data) {
  keenClient.addEvent('coverage', {
    'projectName': projectName,
    'coverage': data,
  });
}

function pushToKeenTask() {
  fs.readFile('coverage/browser/coverage-summary.json',
    {'encoding': 'utf-8'},
    function (err, data) {
      if (err) throw err;
      for(var i = 0; i < 1; i++) {
        pushToKeen(transformCoverage(JSON.parse(data)));
      }
  });
}

gulp.task('keen', pushToKeenTask);
