'use strict';

var express = require('express');
var controller = require('./cli.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/compile', auth.isAuthenticated(), controller.compile);
router.post('/run', auth.isAuthenticated(), controller.run);

module.exports = router;
