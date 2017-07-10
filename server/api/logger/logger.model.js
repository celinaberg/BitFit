'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoggerSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  startTime: Date,
  endTime: { type: Date, default: Date.now },
  numCompiles: Number,
  numErrorFreeCompiles: Number,
  numRuns: Number,
  numHints: Number,
  totalAttempts: Number,
  correctAttempts: Number
});

module.exports = mongoose.model('Logger', LoggerSchema);
