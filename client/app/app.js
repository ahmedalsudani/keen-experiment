'use strict';
var client = require('../keen-client');
var Keen = require('keen-js');

window.client = client;

Keen.ready(function(){
  console.log('drawing');
  var query = new Keen.Query("average", {
    eventCollection: "coverage",
    interval: "minutely",
    targetProperty: "coverage.lines.pct",
    timeframe: "this_2_days",
    timezone: "UTC"
  });
  client.draw(query, document.getElementById("chart"), {
    chartType: "linechart",
    title: null,
    height: 175,
    width: "auto",
    colors: null,
    chartOptions: {
    legend: { position: "none" },
    tooltip: { trigger: 'none' },
    chartArea: {
      left: "5%",
      top: "5%",
      height: "85%",
      width: "95%"
      }
    }
  });
});
