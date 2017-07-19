import angular from 'angular'

import './logger.css'

import routing from './logger.routes'
import LoggerController from './logger.controller'
import NavBar from '../../components/navbar'

export default angular.module('bitfit.admin.logger', [NavBar])
  .config(routing)
  .controller('loggerCtrl', LoggerController)
  .name
