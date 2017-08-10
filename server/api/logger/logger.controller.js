
const _ = require('lodash')
const Logger = require('./logger.model')

// Get list of loggers
exports.index = function (req, res) {
  Logger.find((err, loggers) => {
    if (err) { return handleError(res, err) }
    return res.status(200).json(loggers)
  })
}

// Get a single logger
exports.show = function (req, res) {
  Logger.findById(req.params.id, (err, logger) => {
    if (err) { return handleError(res, err) }
    if (!logger) { return res.sendStatus(404) }
    return res.json(logger)
  })
}

// Creates a new logger in the DB.
exports.create = function (req, res) {
  Logger.create(req.body, (err, logger) => {
    if (err) { return handleError(res, err) }
    return res.status(201).json(logger)
  })
}

// Updates an existing logger in the DB.
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id }
  Logger.findById(req.params.id, (err, logger) => {
    if (err) { return handleError(res, err) }
    if (!logger) { return res.sendStatus(404) }
    const updated = _.merge(logger, req.body)
    updated.save((err) => {
      if (err) { return handleError(res, err) }
      return res.status(200).json(logger)
    })
  })
}

// Deletes a logger from the DB.
exports.destroy = function (req, res) {
  Logger.findById(req.params.id, (err, logger) => {
    if (err) { return handleError(res, err) }
    if (!logger) { return res.sendStatus(404) }
    logger.remove((err) => {
      if (err) { return handleError(res, err) }
      return res.send(204)
    })
  })
}

function handleError (res, err) {
  return res.status(500).send(err)
}
