import angular from 'angular'

import './logger.css'

import routing from './logger.routes'
import LoggerController from './logger.controller'
import NavBar from '../../../components/navbar'
import Questions from '../../../components/questions/questions.service'
import Topics from '../../../components/topics/topics.service'
import adminSidebar from '../adminSidebar'

export default angular.module('bitfit.admin.logger', [NavBar, Questions, Topics, adminSidebar])
  .config(routing)
  .controller('loggerCtrl', LoggerController)
  .name
