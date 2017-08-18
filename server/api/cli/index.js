
const express = require('express')
const controller = require('./cli.controller')
const auth = require('../../auth/auth.service')

const router = express.Router()

router.post('/compile', auth.isAuthenticated(), controller.compile)
router.post('/run', auth.isAuthenticated(), controller.run)
router.post('/killProcess', auth.isAuthenticated(), controller.killProcess)

module.exports = router
