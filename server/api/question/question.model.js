
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

QuestionSchema.methods.toJSON = function () {
  var obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  delete obj.__v
  return obj
}

module.exports = mongoose.model('Question', QuestionSchema)
