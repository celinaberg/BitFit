import angular from 'angular'

import './allQuestions.css'

import routing from './allQuestions.routes'
import AllQuestionsController from './allQuestions.controller'
import NavBar from '../../components/navbar'

export default angular.module('bitfit.admin.all-questions', [NavBar])
  .config(routing)
  .controller('AllQuestionsCtrl', AllQuestionsController)
  .name
