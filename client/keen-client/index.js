'use strict';
var Keen = require('keen-js');

var client = new Keen({
  'projectId': process.env['KEEN_PROJECT_ID'],
  'readKey': process.env['KEEN_READ_KEY']
});

module.exports = client;
