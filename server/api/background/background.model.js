'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BackgroundSchema = new Schema({
  path: String,
  info: String,
});

module.exports = mongoose.model('Background', BackgroundSchema);