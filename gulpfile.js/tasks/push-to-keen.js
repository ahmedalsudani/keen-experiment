var fs = require('fs');
var gulp = require('gulp');
var keen = require('keen.io');
var moment = require('moment');
var R = require('ramda');
var transformCoverage = require('../helpers/transform-coverage');
require('dotenv').load();

var projectName = process.env.PROJECT_NAME;

var keenClient = keen.configure({
  'writeKey': process.env.KEEN_WRITE_KEY,
  'readKey': process.env.KEEN_READ_KEY,
  'projectId': process.env.KEEN_PROJECT_ID
});

function randomize(data) {
  var constant = Math.random();
  function handleCoverageNumbers(coverageType) {
    return Math.floor(constant * coverageType);
  }
  function handleCoverageTypes(coverageField) {
    return R.mapObj(handleCoverageNumbers)(coverageField);
  }
  return R.mapObj(handleCoverageTypes)(data);
}

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
        pushToKeen(randomize(transformCoverage(JSON.parse(data))));
      }
  });
}

gulp.task('keen', pushToKeenTask);
