'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var HelpForumSchema = new Schema({
  email: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userQuestion: String,
  date: { type: Date, default: Date.now },
  answered: { type: Boolean, default: false },
  questionInstructions: String,
  topicString: String
});

module.exports = mongoose.model('HelpForum', HelpForumSchema);
