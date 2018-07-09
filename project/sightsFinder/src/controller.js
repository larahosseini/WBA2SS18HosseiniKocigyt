/*
    controller.js:
    - define business logic of application
    - listen to events 
    - create list of nearest sights
*/

// load dependencies 
var sightsService = require('./sightsService');
var distanceService = require('./distanceService');

// list of connected clients
var clients = {};

// initialize application 
exports.init = function(io) {
  // define event listeners
  io.on('connection', function(client) { 
  	// new client connected -> store client in list
  	clients[client.id] = {};
  	clients[client.id].socket = client; 
  	console.log('New client "' + client.id + '" connected!');
  	console.log('Current list of clients: ' + displayListOfClients());

  	// location of client changed -> store location of client in list and load list of sights
	client.on('locationChanged', function(location) {
	  // store location of client in list
	  clients[client.id].location = location; 
	  console.log('Location of client "' + client.id + '" set to ' + location.lat + ', ' + location.lng);

      // get all sights from sights api and trigger loading of nearest sights via callback 'loadNearestSights'
      sightsService.getSights(client.id, loadNearestSights);
  	});

    // client disconnected -> delete client from list
  	client.on('disconnect', function() {
      delete clients[client.id];
      console.log('Client "' + client.id + '" disconnected!');
      console.log('Current list of clients: ' + displayListOfClients());
    });  	
  });
}

// callback of sights api request -> calculate distances to sights, to create list of nearest sights
var loadNearestSights = function(clientId, sights) {
  // get client of this request and his properties
  var client = clients[clientId];
  var socket = client.socket;
  var location = client.location;

  // store sights of client in list
  clients[clientId].sights = sights;

  // calculate the distance from the selected location to each sight 
  for(var i in sights) {
  	// call distance matrix api from google
	distanceService.calculateDistance(clientId, i, sights[i], location, sendSightsList);
  }
}

// callback of distance matrix api request -> create list of nearest sights
var sendSightsList = function(clientId, sightNumber, distance) {
  // get client of this request and his properties
  var client = clients[clientId];
  var socket = client.socket;
  var location = client.location;
  var sights = clients[clientId].sights;

  // store distance of current sight in list of sights and updated sights of client in list
  sights[sightNumber].distance = distance;
  clients[clientId].sights = sights;

  // send updated list of sights with distances to client
  socket.emit('sightsList', sights);
  console.log('Updated list of ' + sights.length + ' sights send to client "' + clientId + '"');
}

// display list of clients in readable form (list of IDs)
var displayListOfClients = function() {
   var clientIds = [];
   for(var id in clients) {
     clientIds.push(id);
   }
   return clientIds;
}