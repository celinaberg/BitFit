/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Cli = require('./cli.model');

exports.register = function (socket) {
  Cli.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Cli.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('cli:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('cli:remove', doc);
}
