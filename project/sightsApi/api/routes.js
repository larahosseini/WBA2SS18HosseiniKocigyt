'use strict';
/*
	routes.js:
	define the application routes
*/

module.exports = function(app) {
  // load dependency
  var controller = require('./controller');

  // define api routes
  app.route('/sights')
    .get(controller.listSights)       // GET ./sights
    .post(controller.createSight);    // POST ./sights

  app.route('/sights/:sightId')
    .get(controller.getSight)         // GET ./sights/:id
    .put(controller.updateSight)      // UPDATE ./sights/:id
    .delete(controller.deleteSight);  // DELETE ./sights/:id
};