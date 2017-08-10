
const express = require('express')
const controller = require('./lesson.controller')
const auth = require('../../auth/auth.service')

const router = express.Router()

router.get('/', controller.index)
// router.get('/:id', controller.show);
router.get('/:id', controller.show)
router.post('/', auth.hasRole('admin'), controller.create)
router.put('/:id', auth.hasRole('admin'), controller.update)
router.patch('/:id', auth.hasRole('admin'), controller.update)
router.delete('/:id', auth.hasRole('admin'), controller.destroy)
router.post('/:id/delquestion', auth.hasRole('admin'), controller.deleteQuestion)
router.post('/:id/questions', auth.hasRole('admin'), controller.addQuestion)

module.exports = router
