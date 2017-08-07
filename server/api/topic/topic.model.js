
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TopicSchema = new Schema({
  // title: String,
  title: { type: String, unique: true, required: true },
  background: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
})

TopicSchema.methods.toJSON = function () {
  var obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  delete obj.__v
  return obj
}

module.exports = mongoose.model('Topic', TopicSchema)
