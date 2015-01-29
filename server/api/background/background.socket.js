/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Background = require('./background.model');

exports.register = function(socket) {
  Background.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Background.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('background:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('background:remove', doc);
}