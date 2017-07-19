import angular from 'angular'

import './allQuestions.css'

import routing from './allQuestions.routes'
import AllQuestionsController from './allQuestions.controller'
import NavBar from '../../../components/navbar'
import Topics from '../../../components/topics/topics.service'
import User from '../../../components/auth/user.service'
import Auth from '../../../components/auth/auth.service'
import 'angular-flash'
import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'angular-ui-ace'

export default angular.module('bitfit.admin.all-questions', [NavBar, Topics, User, Auth, 'flash'])
  .config(routing)
  .controller('AllQuestionsCtrl', AllQuestionsController)
  .name
