/*
    server.js:
    configure and start the node.js server 
*/

// load dependencies 
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    server = require('http').createServer(app),  
    io = require('socket.io')(server),
    controller = require('./src/controller');
    port = process.env.PORT || 5000; // set server port for application  

// set views directory and view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// configure application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules')); 

// GET / -> render index page with google map 
app.get('/', function (request, response) {
  response.render('index', { 
    title : 'Sights Finder' 
  });
});

// initialize application (define event listeners)
controller.init(io);

// start the application
server.listen(port);
console.log('Sights Finder running at http://localhost:' + port);