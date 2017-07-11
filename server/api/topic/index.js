'use strict';

var express = require('express');
var controller = require('./topic.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', controller.index);
// router.get('/:id', controller.show);
router.get('/:title', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.post('/:id/delquestion', auth.hasRole('admin'), controller.deleteQuestion);
router.post('/:id/questions', auth.hasRole('admin'), controller.addQuestion);

module.exports = router;
