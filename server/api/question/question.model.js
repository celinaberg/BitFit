'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  instructions: String,
  code: String,
  className: String,
  readOnly: Boolean,
  hints: [String],
  tags: String,
  expectedOutput: String,
  codeEvaluator: String,
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }
});

module.exports = mongoose.model('Question', QuestionSchema);