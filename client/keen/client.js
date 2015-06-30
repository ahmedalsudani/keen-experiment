'use strict';
var Keen = require('keen.io');

var client = new Keen.configure({
  'projectId': process.env['KEEN_PROJECT_ID'],
  'masterKey': process.env['KEEN_MASTER_KEY']
});

module.exports = client;
