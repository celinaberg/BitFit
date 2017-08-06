
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const QuestionSchema = new Schema({
  title: String,
  instructions: String,
  code: String,
  className: String,
  readOnly: Boolean,
  hints: [String],
  tags: String,
  expectedOutput: String,
  codeEvaluator: String,
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }
})

module.exports = mongoose.model('Question', QuestionSchema)
