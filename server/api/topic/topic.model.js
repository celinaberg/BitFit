'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    //Question = require('../question/question.model');


var TopicSchema = new Schema({
  title: String,
  background: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

module.exports = mongoose.model('Topic', TopicSchema);