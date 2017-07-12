'use strict';

var express = require('express');
var cwl = require('./cwl');

var router = express.Router();

router.use('/cwl', cwl);

module.exports = router;
