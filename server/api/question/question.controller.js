
const _ = require('lodash')
const Question = require('./question.model')

function handleError (res, err) {
  return res.status(500).send(err)
}

// Get list of questions
exports.index = function (req, res) {
  Question.find((err, questions) => {
    if (err) { return handleError(res, err) }
    return res.status(200).json(questions)
  })
}

// Get list of questions for export
exports.export = function (req, res) {
  Question.find({}, { _id: 0, topic: 0 }, (err, questions) => {
    if (err) { return handleError(res, err) }
    return res.status(200).json(questions)
  })
}

// Get a single question
exports.show = function (req, res) {
  Question.findById(req.params.id, (err, question) => {
    if (err) { return handleError(res, err) }
    if (!question) { return res.send(404) }
    return res.json(question)
  })
}

// Creates a new question in the DB.
exports.create = function (req, res) {
  Question.create(req.body, (err, question) => {
    if (err) { return handleError(res, err) }
    return res.status(201).json(question)
  })
}

// Import many questions to DB.
exports.import = function (req, res) {
  Question.collection.insert(req.body, (err, questions) => {
    if (err) { return handleError(res, err) }
    return res.status(201).json(questions)
  })
}

// Updates an existing question in the DB.
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id }
  Question.findById(req.params.id, (err, question) => {
    if (err) { return handleError(res, err) }
    if (!question) { return res.send(404) }
    question.hints = req.body.hints // manually copy as merge doesn't
    const updated = _.merge(question, req.body)
    updated.save((err) => {
      if (err) { return handleError(res, err) }
      return res.status(200).json(question)
    })
  })
}

// Deletes a question from the DB.
exports.destroy = function (req, res) {
  Question.findById(req.params.id, (err, question) => {
    if (err) { return handleError(res, err) }
    if (!question) { return res.send(404) }
    question.remove((err) => {
      if (err) { return handleError(res, err) }
      return res.send(204)
    })
  })
}
