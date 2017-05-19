/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Logger = require('./logger.model');

exports.register = function(socket) {
  Logger.schema.post('save', function(doc) {
    onSave(socket, doc);
  });
  Logger.schema.post('remove', function(doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('logger:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('logger:remove', doc);
}
