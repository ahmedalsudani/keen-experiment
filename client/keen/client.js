'use strict';
var Keen = require('keen.io');

var client = new Keen.configure({
  'projectId': process.env['KEEN_PROJECT_ID'],
  'writeKey': process.env['KEEN_WRITE_KEY'],
  'readKey': process.env['KEEN_READ_KEY']
});

module.exports = client;
