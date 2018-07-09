/*
    sightsService.js:
    send requests to sights api 
*/

// set url of sights api
var api = 'https://sights-api.herokuapp.com';

// load dependencies 
var request = require('request');

// send request GET ./sights to sights api to get all sights -> trigger loading of nearest sights 
exports.getSights = function(clientId, callback) {
  // set options of request
  var options = {  
    url: api + '/sights',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Accept-Charset': 'utf-8',
    }
  };

  // send request GET ./sights to get all sights from sights api
  request(options, function(error, response, body) {
    var sights = JSON.parse(body);

    // trigger loading of nearest sights via callback 'loadNearestSights'
    callback(clientId, sights);
  });
}