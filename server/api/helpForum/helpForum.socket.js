/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var HelpForum = require('./helpForum.model');

exports.register = function (socket) {
  HelpForum.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  HelpForum.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('helpForum:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('helpForum:remove', doc);
}
