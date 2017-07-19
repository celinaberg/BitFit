import angular from 'angular'
import Logger from './logger'
import EditContent from './editContent'
import AllQuestions from './allQuestions'

import './admin.css'

import routing from './admin.routes'
import AdminController from './admin.controller'

import Topics from '../../components/topics/topics.service'

export default angular.module('bitfit.admin', [Logger, EditContent, AllQuestions, Topics])
  .config(routing)
  .controller('AdminCtrl', AdminController)
  .name
