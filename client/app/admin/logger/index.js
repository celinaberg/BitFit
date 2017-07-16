import angular from 'angular'

import styles from './logger.css'

import routing from './logger.routes'
import LoggerController from './logger.controller'

export default angular.module('bitfit.admin.logger', [])
  .config(routing)
  .controller('loggerCtrl', LoggerController)
  .name
