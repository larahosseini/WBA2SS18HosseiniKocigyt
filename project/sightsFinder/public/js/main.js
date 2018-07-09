/*
    main.js:
    - define business logic of client
    - load and display google map
    - trigger loading of nearest sights
*/

// initialize client application
$(document).ready(function() {
  app.init();
});

// set url of sights finder application
var sightsFinderUrl = 'http://localhost:5000';

var app = {

  // initialize client application -> load google map and connect with sights finder application
  init: function() {
    // initialize variables
    app.sights = [];
    app.markers = [];

    // load and initialize google map
    google.maps.event.addDomListener(window, 'load', function() {
      app.initMap();
    });

    // connect client with sights finder application
    app.socket = io.connect(sightsFinderUrl);

    // list of sights loaded -> display list of nearest sights
    app.socket.on('sightsList', function(sights) {
      app.sights = sights;
      app.displayListOfSights();
    });
  },

  // load and initialize google map
  initMap: function() {
    // set center and other options of google map
    var center = new google.maps.LatLng(48.140711, 11.556212);
    var mapOptions = {
      zoom: 13,
      center: center,
    };

    // display google map
    app.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // click on google map -> place marker on map and load list of sights
    app.map.addListener('click', function(event) {
      app.selectLocation(event.latLng);
    });
  },
    
  // select location on map -> place marker on map and load list of sights
  selectLocation: function(position) {
    console.log(position);

    // remove markers of old selection
    app.removeAllMarkers();

    // place marker at selected location on google map
    app.placeMarker(position, 'A');

    // send selected location to sights finder application to get list of nearest sights
    app.socket.emit('locationChanged', position);
  },

  // display list of nearest sights next to google map
  displayListOfSights: function() {
    // sort list of sights by distance (nearest on top)
    var sights = app.sortSightsByDistance(app.sights);
    console.log(sights);

    // create html content from list of sights
    var html = "";
    for(var i in sights) {
      html += '<div class="card"><div class="card-header" id="headingOne"><h5 class="mb-0"><button class="btn btn-link collapsed"';
      html += 'type="button" data-toggle="collapse" data-target="#collapse' + i + '" data-lat="' + sights[i].latitude + '" ';
      html += 'data-lng="' + sights[i].longitude + '">' + sights[i].name + '</button></h5><p>' + sights[i].distance + '</p></div>';
      html += '<div id="collapse' + i + '" class="collapse" data-parent="#sightsList"><div class="card-body">' + sights[i].description;
      html += '</div></div></div>';  
    }

    // display list of nearest sights next to google map
    $('#sightsList').html(html);

    // click on specific sight in list of sights -> place marker at location of sight on map
    $('#sightsList button').click(function() {
      // remove marker of last selected sight from map
      if(app.markers.length > 1){
        app.removeMarker(app.markers.length-1);
      }
      
      // place marker at location of selected sight on map
      var position = {
        lat: $(this).data('lat'),
        lng: $(this).data('lng')
      };
      app.placeMarker(position, 'B');
    });
  },

  // place marker at specific position on google map
  placeMarker: function(position, label) {
    var marker = new google.maps.Marker({
      position: position,
      label: label,
      map: app.map
    });
    app.map.panTo(position);
    app.markers.push(marker);
  },

  // remove specific marker from google map
  removeMarker: function(number) {
    app.markers[number].setMap(null);
  },

  // remove all markers from google map
  removeAllMarkers: function() {
    for(var i=0; i < app.markers.length; i++){
      app.markers[i].setMap(null);
    }
  },

  // sort list of sights by distance (nearest on top)
  sortSightsByDistance: function(sights) {
    var sortedSights = sights.sort(function(a, b){
      if(a.distance != undefined && b.distance != undefined){
        var keyA = a.distance.split(' ')[0],
            keyB = b.distance.split(' ')[0];
        return keyA - keyB;
      }
    });

    return sortedSights;
  }

};