'use strict';

var _ = require('lodash');
var Logger = require('./logger.model');

// Get list of loggers
exports.index = function (req, res) {
  Logger.find(function (err, loggers) {
    if (err) { return handleError(res, err); }
    return res.json(200, loggers);
  });
};

// Get a single logger
exports.show = function (req, res) {
  Logger.findById(req.params.id, function (err, logger) {
    if (err) { return handleError(res, err); }
    if (!logger) { return res.send(404); }
    return res.json(logger);
  });
};

// Creates a new logger in the DB.
exports.create = function (req, res) {
  Logger.create(req.body, function (err, logger) {
    if (err) { return handleError(res, err); }
    return res.json(201, logger);
  });
};

// Updates an existing logger in the DB.
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Logger.findById(req.params.id, function (err, logger) {
    if (err) { return handleError(res, err); }
    if (!logger) { return res.send(404); }
    var updated = _.merge(logger, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, logger);
    });
  });
};

// Deletes a logger from the DB.
exports.destroy = function (req, res) {
  Logger.findById(req.params.id, function (err, logger) {
    if (err) { return handleError(res, err); }
    if (!logger) { return res.send(404); }
    logger.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
