'use strict';
var Keen = require('keen-js');

angular.module('charter', ['keen-coverage'])

.service('coverageService', function (coverage) {
  var coverageService = coverage.createKeenCoverageService(
    process.env['KEEN_PROJECT_ID'],
    process.env['KEEN_READ_KEY']
  )
  return coverageService;
})

.controller('allProjectsCtrl', function ($element, coverage, coverageService) {
  coverageService.chartAllProjects($element[0]);
})

.controller('oneProjectCtrl', function ($element, coverageService) {
  coverageService.chartProject('keen-experiment', $element[0]);
});
