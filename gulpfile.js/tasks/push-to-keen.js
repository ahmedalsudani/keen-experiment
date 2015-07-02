var fs = require('fs');
var gulp = require('gulp');
var keen = require('keen.io');
var transformCoverage = require('../helpers/transform-coverage');
require('dotenv').load();

var projectName = process.env.PROJECT_NAME;

var keenClient = keen.configure({
  'writeKey': process.env.KEEN_WRITE_KEY,
  'readKey': process.env.KEEN_READ_KEY,
  'projectId': process.env.KEEN_PROJECT_ID
});

gulp.task('keen', function () {
  fs.readFile('coverage/browser/coverage-summary.json',
    {'encoding': 'utf-8'},
    function (err, data) {
      if (err) throw err;
      keenClient.addEvent('coverage',
        {
          'projectName': projectName,
          'coverage': transformCoverage(JSON.parse(data))
        });
    });
});
