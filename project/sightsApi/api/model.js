'use strict';
/*
	model.js:
	define the database schema of a sight
*/

// load dependencies 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the database schema of a sight
var SightSchema = new Schema({
  name: {
    type: String,
    required: 'Enter the name of the sight'
  },
  description: {
    type: String,
    required: 'Enter the description of the sight'
  },
  longitude: {
    type: Number,
    required: 'Enter the longitude of the sight\'s position'
  },
  latitude: {
    type: Number,
    required: 'Enter the latitude of the sight\'s position'
  }
});

module.exports = mongoose.model('Sights', SightSchema);