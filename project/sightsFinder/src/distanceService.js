/*
    distanceService.js:
    send requests to distance matrix api from google 
*/

// load dependencies 
var distanceMatrix = require('google-distance-matrix');

// set api key of distance matrix api from google
distanceMatrix.key('AIzaSyCD1DMLCi_fe6rKrm5GtkjWYROI2QBXOKM');

// send request to distance matrix api to calculate distance between selected location and a sight -> send back list of nearest sights
exports.calculateDistance = function(clientId, sightNumber, sight, location, callback) {
  // add selected location to origins and current sight to destinations
  var origins = [location.lat + ',' + location.lng];
  var destinations = [sight.latitude + ',' + sight.longitude];

  // send request to distance matrix api to calculate distance between selected location and a sight
  distanceMatrix.matrix(origins, destinations, function (error, distances) {
    if(error) {
      return console.log(error);
    }
    if(!distances) {
      return console.log('No distances calculated!');
    }
    if(distances.status == 'OK') {
      for(var i=0; i < origins.length; i++) {
        for(var j = 0; j < destinations.length; j++) {
          var origin = distances.origin_addresses[i];
          var destination = distances.destination_addresses[j];
          if (distances.rows[0].elements[j].status == 'OK') {
              var distance = distances.rows[i].elements[j].distance.text;
              console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
          } else {
              console.log(destination + ' is not reachable by land from ' + origin);
          }
        }
      }
    }

    // send back list of nearest sights via callback 'sendSightsList'
    callback(clientId, sightNumber, distance);
  });
}