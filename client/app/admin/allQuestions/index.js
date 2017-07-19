import angular from 'angular'

import './allQuestions.css'

import routing from './allQuestions.routes'
import AllQuestionsController from './allQuestions.controller'
import NavBar from '../../../components/navbar'
import Topics from '../../../components/topics/topics.service'
import User from '../../../components/auth/user.service'
import Auth from '../../../components/auth/auth.service'
import ngFlash from 'angular-flash'

export default angular.module('bitfit.admin.all-questions', [NavBar, Topics, User, Auth, 'flash'])
  .config(routing)
  .controller('AllQuestionsCtrl', AllQuestionsController)
  .name
