'use strict';

var _ = require('lodash');
var Background = require('./background.model');

// Get list of backgrounds
exports.index = function(req, res) {
  Background.find(function (err, backgrounds) {
    if(err) { return handleError(res, err); }
    return res.json(200, backgrounds);
  });
};

// Get a single background
exports.show = function(req, res) {
  Background.findById(req.params.id, function (err, background) {
    if(err) { return handleError(res, err); }
    if(!background) { return res.send(404); }
    return res.json(background);
  });
};

// Creates a new background in the DB.
exports.create = function(req, res) {
  Background.create(req.body, function(err, background) {
    if(err) { return handleError(res, err); }
    return res.json(201, background);
  });
};

// Updates an existing background in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Background.findById(req.params.id, function (err, background) {
    if (err) { return handleError(res, err); }
    if(!background) { return res.send(404); }
    var updated = _.merge(background, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, background);
    });
  });
};

// Deletes a background from the DB.
exports.destroy = function(req, res) {
  Background.findById(req.params.id, function (err, background) {
    if(err) { return handleError(res, err); }
    if(!background) { return res.send(404); }
    background.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Gets background for given topic URL
exports.getBackground = function(req, res) {
  var url = String(req.body.urlPath);

  Background.find({ path: url }, function (err, background) {
    if(err) { return handleError(res, err); }
    if(!background) { return res.send(404); }
    return res.json(background);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}