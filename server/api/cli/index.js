'use strict';

var express = require('express');
var controller = require('./cli.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.post('/compile', auth.isAuthenticated(), controller.compile);
router.post('/run', auth.isAuthenticated(), controller.run);

module.exports = router;
