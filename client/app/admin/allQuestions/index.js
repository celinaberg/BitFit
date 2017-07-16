import angular from 'angular'

import './allQuestions.css'

import routing from './allQuestions.routes'
import AllQuestionsController from './allQuestions.controller'

export default angular.module('bitfit.admin.all-questions', [])
  .config(routing)
  .controller('AllQuestionsCtrl', AllQuestionsController)
  .name
