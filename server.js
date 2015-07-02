module.exports = function server() {
  'use strict';
  var cors = require('cors');
  var express = require('express');
  var reloader = require('connect-livereload')
  var app = express();

  app.use(reloader());
  app.use(cors());
  app.use(express.static('./.tmp/dest'));

  app.listen(9000, function(){
    console.log('App Listening on localhost:9000');
  });

};
