

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  // title: String,
  title: { type: String, unique: true, required: true },
  background: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

module.exports = mongoose.model('Topic', TopicSchema);
