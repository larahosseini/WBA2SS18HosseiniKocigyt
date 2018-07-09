/*
	server.js:
	configure and start the node.js server 
*/

// load dependencies 
var express = require('express'),
    mongoose = require('mongoose'),
  	bodyParser = require('body-parser'),
  	Sight = require('./api/model'), // created model loading here
  	app = express(),
    port = process.env.PORT || 3000; // set server port for application  
  
// connect to the database (MongoDB on mLab)
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin5@ds161610.mlab.com:61610/sightsdb'); 

// configure application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// import and register the routes
var routes = require('./api/routes'); 
routes(app); 

// start the application
app.listen(port);
console.log('Sights API running at http://localhost:' + port);