'use strict';
/*
  controller.js:
  define the application logic
*/

// load dependencies 
var mongoose = require('mongoose'),
    Sight = mongoose.model('Sights');

// GET ./sights -> List all sights
exports.listSights = function(request, response) {
  Sight.find({}, function(error, sights) {
    if (error) {
      return response.status(500).json({ error: "Die Liste der Sehenswürdigkeiten konnte nicht geladen werden."});
    }
    
    return response.json(sights);
  });
};

// POST ./sights -> Add a new sight
exports.createSight = function(request, response) {
  var newSight = new Sight(request.body);
  newSight.save(function(error, sight) {
    if (error) {
      return response.status(500).json({ error: "Die neue Sehenswürdigkeit konnte nicht zur Datenbank hinzugefügt werden."});
    }

    return response.json(sight);
  });
};

// GET ./sights/:id -> Get a specific sight by id
exports.getSight = function(request, response) {
  Sight.findById(request.params.sightId, function(error, sight) {
    if (error) {
      return response.status(500).json({ error: "Die gewählte Sehenswürdigkeit konnte nicht geladen werden."});
    }
    if (!sight) {
      return response.status(404).json({ error: "Eine Sehenswürdigkeit mit dieser ID konnte nicht gefunden werden."});
    } 

    return response.json(sight);
  });
};

// UPDATE ./sights/:id -> Update the properties of a specific sight
exports.updateSight = function(request, response) {
  Sight.findOneAndUpdate({_id: request.params.sightId}, request.body, {new: true}, function(error, sight) {
    if (error) {
      return response.status(500).json({ error: "Die gewählte Sehenswürdigkeit konnte nicht bearbeitet werden."});
    }

    return response.json(sight);
  });
};

// DELETE ./sights/:id -> Delete a specific sight by id
exports.deleteSight = function(request, response) {
  Sight.remove({
    _id: request.params.sightId
  }, function(error, sight) {
    if (error) {
      return response.status(500).json({ error: "Die gewählte Sehenswürdigkeit konnte nicht gelöscht werden."});
    }

    return response.json({ message: 'Die Sehenswürdigkeit "' + sight.name + '" wurde erfolgreich gelöscht.'});
  });
};