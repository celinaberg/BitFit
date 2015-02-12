'use strict';

var _ = require('lodash');
var HelpForum = require('./helpForum.model');

// Get list of helpForums
exports.index = function(req, res) {
  HelpForum.find(function (err, helpForums) {
    if(err) { return handleError(res, err); }
    return res.json(200, helpForums);
  });
};

// Get a single helpForum
exports.show = function(req, res) {
  HelpForum.findById(req.params.id, function (err, helpForum) {
    if(err) { return handleError(res, err); }
    if(!helpForum) { return res.send(404); }
    return res.json(helpForum);
  });
};

// Creates a new helpForum in the DB.
exports.create = function(req, res) {
  HelpForum.create(req.body, function(err, helpForum) {
    if(err) { return handleError(res, err); }
    return res.json(201, helpForum);
  });
};

// Updates an existing helpForum in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  HelpForum.findById(req.params.id, function (err, helpForum) {
    if (err) { return handleError(res, err); }
    if(!helpForum) { return res.send(404); }
    var updated = _.merge(helpForum, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, helpForum);
    });
  });
};

// Deletes a helpForum from the DB.
exports.destroy = function(req, res) {
  HelpForum.findById(req.params.id, function (err, helpForum) {
    if(err) { return handleError(res, err); }
    if(!helpForum) { return res.send(404); }
    helpForum.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}