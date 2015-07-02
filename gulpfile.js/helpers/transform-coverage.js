var R = require('ramda');

function calculatePercentage(coverage) {
  return coverage.covered / (coverage.total - coverage.skipped);
}

function transformCoverage(coverageObj) {
  var totalCoverage;
  var fileNames = R.keys(coverageObj);
  var coverageValues = R.values(coverageObj);

  function addFields(coverage1, coverage2) {
    var fields = R.keys(coverage2);
    var newCoverage = {};

    R.forEach(function (field) {
      newCoverage[field] = coverage1[field] + coverage2[field];
    })(fields);
    newCoverage.pct = 100 * calculatePercentage(newCoverage);
    return newCoverage;
  }

  function addFiles(file1, file2) {
    var newFile = {};
    var fields = R.keys(file2);

    if (file1 !== null) {
      R.forEach(function (key) {
        newFile[key] = addFields(file1[key], file2[key]);
      })(fields);
    } else if (file1 === null){
      newFile = file2;
    } else {
      throw new Error('Can\'t handle parameter')
    }
    return newFile;
  }

  totalCoverage = R.reduce(addFiles, null)(coverageValues);

  return totalCoverage;
}

module.exports = transformCoverage;
