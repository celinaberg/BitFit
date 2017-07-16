
const _ = require('lodash')
const Logger = require('./logger.model')

// Get list of loggers
exports.index = function (req, res) {
  Logger.find((err, loggers) => {
    if (err) { return handleError(res, err) }
    return res.json(200, loggers)
  })
}

// Get a single logger
exports.show = function (req, res) {
  Logger.findById(req.params.id, (err, logger) => {
    if (err) { return handleError(res, err) }
    if (!logger) { return res.send(404) }
    return res.json(logger)
  })
}

// Creates a new logger in the DB.
exports.create = function (req, res) {
  Logger.create(req.body, (err, logger) => {
    if (err) { return handleError(res, err) }
    return res.json(201, logger)
  })
}

// Updates an existing logger in the DB.
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id }
  Logger.findById(req.params.id, (err, logger) => {
    if (err) { return handleError(res, err) }
    if (!logger) { return res.send(404) }
    const updated = _.merge(logger, req.body)
    updated.save((err) => {
      if (err) { return handleError(res, err) }
      return res.json(200, logger)
    })
  })
}

// Deletes a logger from the DB.
exports.destroy = function (req, res) {
  Logger.findById(req.params.id, (err, logger) => {
    if (err) { return handleError(res, err) }
    if (!logger) { return res.send(404) }
    logger.remove((err) => {
      if (err) { return handleError(res, err) }
      return res.send(204)
    })
  })
}

function handleError (res, err) {
  return res.send(500, err)
}
